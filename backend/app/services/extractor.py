import re

def extract_ingredients(raw_text: str) -> list[str]:
    if not raw_text:
        return []

    # Normalize common separators to splitting boundaries
    text = raw_text.strip()

    # Drop a leading "Ingredients:" if it leaked in
    text = re.sub(r"(?i)^\s*ingredients\s*:\s*", "", text)

    # Split on: comma, semicolon, newline, bullet chars, pipes
    parts = re.split(r"[,\n;|•●]+", text)

    cleaned: list[str] = []
    for part in parts:
        item = part.strip(" \t\r\n-–—●•")
        if item:
            cleaned.append(item)

    return cleaned