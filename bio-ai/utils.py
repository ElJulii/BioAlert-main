from ultralytics import YOLO
from PIL import Image
import io
import json
import os

# cargar modelo
model = YOLO("model/best.pt")

# categorías
DOMESTIC_ANIMALS = [
    "dog",
    "cat",
    "cow",
    "cattle",
    "horse",
    "donkey",
    "mule",
    "sheep",
    "goat",
    "pig",
    "chicken",
    "rooster",
    "hen",
    "duck",
    "goose",
    "turkey",
    "rabbit",
    "guinea_pig",
    "hamster",
    "parrot_pet",
    "canary",
    "goldfish",
    "fish_tank_fish",
    "alpaca",
    "llama"
]

WILD_ANIMALS = [
    "elephant", "lion", "zebra", "bear", "giraffe",
    "monkey", "tiger", "leopard", "cheetah",
    "wolf", "fox", "coyote", "hyena",
    "deer", "moose", "elk", "antelope",
    "buffalo", "bison", "wild_boar",
    "kangaroo", "koala", "panda",
    "raccoon", "otter", "beaver",
    "hedgehog", "armadillo", "porcupine",
    "sloth", "tapir",
    "hippopotamus", "crocodile", "alligator",
    "eagle", "hawk", "falcon", "owl",
    "parrot", "macaw",
    "penguin", "seal", "sea_lion",
    "dolphin", "whale",
    "shark", "octopus",
    "snake", "python", "cobra",
    "frog", "toad",
    "lizard", "iguana",
    "bat", "lemur"
]

def load_endangered():
    base_dir = os.path.dirname(__file__)
    json_path = os.path.join(base_dir, "data", "endangered_animals.json")

    with open(json_path) as f:
        data = json.load(f)

    return data["endangered"]


def analyze_images(files):

    detected_animals = set()
    endangered_list = load_endangered()

    for file in files:
        try:
            contents = file.file.read()

            if not contents:
                continue

            image = Image.open(io.BytesIO(contents)).convert("RGB")

            results = model(image)

            for r in results:
                for box in r.boxes:
                    class_id = int(box.cls[0])
                    class_name = model.names[class_id].lower()
                    detected_animals.add(class_name)

        except Exception as e:
            print(f"Error processing file: {e}")
            continue

    detected_animals = list(detected_animals)

    # No animals
    if len(detected_animals) == 0:
        return {
            "animalDetected": False,
            "animals": [],
            "status": "ignored",
            "priority": False
        }

    # Domestics
    for animal in detected_animals:
        if animal in DOMESTIC_ANIMALS:
            return {
                "animalDetected": False,
                "animals": detected_animals,
                "status": "rejected",
                "priority": False
            }

    # In danger
    for animal in detected_animals:
        if animal in endangered_list:
            return {
                "animalDetected": True,
                "animals": detected_animals,
                "status": "priority",
                "priority": True
            }

    # Wild animals
    for animal in detected_animals:
        if animal in WILD_ANIMALS:
            return {
                "animalDetected": True,
                "animals": detected_animals,
                "status": "accepted",
                "priority": False
            }

    # fallback
    return {
        "animalDetected": False,
        "animals": detected_animals,
        "status": "ignored",
        "priority": False
    }
