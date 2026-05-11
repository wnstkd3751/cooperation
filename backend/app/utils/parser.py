import re


async def parse_receipt_text(lines):

    items = []

    for line in lines:

        # 공백 정리
        line = line.strip()

        if not line:
            continue

        # 숫자 포함 안하면 제외
        if not re.search(r"\d", line):
            continue

        words = line.split()

        # 너무 짧으면 제외
        if len(words) < 2:
            continue

        name = ""
        quantity = 1

        # =========================
        # 상품명 추출
        # =========================
        name = words[0]

        # =========================
        # 수량 추출
        # =========================
        for word in words:

            # "2", "3개" 처리
            if word.isdigit():
                quantity = int(word)
                break

            if "개" in word:
                num = re.sub(r"[^0-9]", "", word)

                if num:
                    quantity = int(num)
                    break

        items.append({
            "name": name,
            "quantity": quantity
        })

    return items