import httpx


BASE_URL = (
    "https://pubchem.ncbi.nlm.nih.gov/rest/pug"
)


async def get_compound_cid(ingredient_name: str):
    url = f"{BASE_URL}/compound/name/{ingredient_name}/cids/JSON"

    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        
        if response.status_code != 200:
            return None
            
        data = response.json()

    try:
        cid = data["IdentifierList"]["CID"][0]
        return cid
    except (KeyError, IndexError):
        return None

async def get_compound_properties(
    cid: int
):

    properties = (
        "Title,"
        "MolecularFormula,"
        "MolecularWeight,"
        "IUPACName"
    )

    url = (
        f"{BASE_URL}/compound/cid/"
        f"{cid}/property/"
        f"{properties}/JSON"
    )

    async with httpx.AsyncClient() as client:

        response = await client.get(url)

    data = response.json()

    property_data = (
        data["PropertyTable"]["Properties"][0]
    )

    return property_data

async def get_compound_hazards(cid: int):

    url = (
        "https://pubchem.ncbi.nlm.nih.gov/"
        f"rest/pug_view/data/compound/"
        f"{cid}/JSON"
    )

    async with httpx.AsyncClient() as client:

        response = await client.get(url)

    data = response.json()

    hazards = []

    # Recursive function
    def extract_hazard_summaries(sections):

        for section in sections:

            heading = section.get(
                "TOCHeading"
            )

            # Target section
            if heading == "Hazards Summary":

                info_list = section.get(
                    "Information",
                    []
                )

                for info in info_list:

                    value = info.get(
                        "Value",
                        {}
                    )

                    strings = value.get(
                        "StringWithMarkup",
                        []
                    )

                    for item in strings:

                        text = item.get(
                            "String"
                        )

                        if text:

                            hazards.append(
                                text
                            )

            # Recursive traversal
            nested_sections = section.get(
                "Section",
                []
            )

            extract_hazard_summaries(
                nested_sections
            )

    # Start traversal
    sections = (
        data.get("Record", {})
        .get("Section", [])
    )

    extract_hazard_summaries(
        sections
    )

    return {
        "cid": cid,
        "hazards_summary": hazards
    }