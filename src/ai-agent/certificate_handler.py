from PIL import Image, ImageDraw, ImageFont
import base64
from io import BytesIO
from datetime import date


def create_certificate(title, name):
    # Settings
    width, height = 800, 500
    background_color = (255, 255, 255)  # White
    border_color = (72, 113, 247)  #4871f7
    border_color_inside = (137, 164, 255)  #89A4FF
    text_color = (0, 0, 0)  # Black

    # Create image
    image = Image.new('RGB', (width, height), background_color)
    draw = ImageDraw.Draw(image)

    # Load fonts
    title_font = ImageFont.truetype("fonts/Roboto-Regular.ttf", 40)
    name_font = ImageFont.truetype("fonts/QwitcherGrypen-Bold.ttf", 60)
    body_font = ImageFont.truetype("fonts/Roboto-Regular.ttf", 16)
    rectangle_font = ImageFont.truetype("fonts/EduVICWANTBeginner-Regular.ttf", 25)

    # Draw borders
    draw.rectangle([10, 10, width - 11, height - 11], outline=border_color_inside, width=5)
    draw.rectangle([0, 0, width - 1, height - 1], outline=border_color, width=5)

    # Draw top and bottom accent rectangles
    draw.rectangle([width // 2 - 80, 0, width // 2 + 80, 40], fill=border_color)

    # Add 'MilestoneMaker' text to rectangles
    draw.text((width // 2, 20), "Milestone Maker", font=rectangle_font, fill=background_color, anchor="mm")

    # Title
    draw.text((width // 2, 110), "Certificate", font=title_font, fill=text_color, anchor="mm")

    # Black bar
    draw.rectangle([100, 170, width - 100, 205], fill=border_color)
    draw.text((width // 2, 187), "This certificate certifies that", font=body_font, fill=background_color, anchor="mm")

    # Name
    draw.text((width // 2, 260), name, font=name_font, fill=text_color, anchor="mm")

    # Body text
    body_text = f"has completed all the milestones of the {title}."
    draw.multiline_text((width // 2, 330), body_text, font=body_font, fill=text_color, anchor="mm", align="center")

    # Date
    today = date.today().strftime("%d %B %Y")
    draw.text((50, 400), f"Awarded on {today}", font=body_font, fill=text_color)
    draw.text((50, 425), "Date", font=body_font, fill=text_color)
    draw.line((50, 420, 250, 420), fill=text_color)

    # Convert to base64
    buffered = BytesIO()
    image.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue())

    base64_decoded = img_str.decode('utf-8')
    return base64_decoded
