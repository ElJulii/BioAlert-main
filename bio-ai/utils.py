from ultralytics import YOLO
from PIL import Image
import io

ANIMAL_CLASSES = [
    "Dog","Cat","Cow","Horse","Sheep","Bird",
    "Monkey","Elephant","Bear","Zebra",
    "Giraffe","Lion","Tiger","Crocodile",
    "Wolf","Fox","Deer","Rabbit","Hare","Squirrel",
    "Raccoon","Kangaroo","Koala","Panda","Leopard",
    "Cheetah","Hyena","Otter","Beaver","Moose",
    "Bison","Buffalo","Camel","Donkey","Goat",
    "Pig","Boar","Antelope","Gazelle","Hippopotamus",
    "Rhinoceros","Chimpanzee","Gorilla","Orangutan",
    "Lemur","Sloth","Armadillo","Porcupine","Hedgehog",
    "Bat","Mole","Weasel","Ferret","Badger",
    "Skunk","Wolverine","Jaguar","Panther","Lynx",
    "Cougar","Ocelot","Caracal","Dingo","Coyote",
    "Jackal","Reindeer","Alpaca","Llama","Yak",
    "Chinchilla","Hamster","GuineaPig","Mouse","Rat",
    "Falcon","Eagle","Hawk","Owl","Parrot",
    "Penguin","Swan","Duck","Goose","Turkey",
    "Peacock","Flamingo","Crane","Stork","Seagull",
    "Shark","Dolphin","Whale","Octopus","Squid",
    "Seal","SeaLion","Walrus","Starfish","Jellyfish",
    "Crab","Lobster","Shrimp","Frog","Toad",
    "Salamander","Lizard","Gecko","Chameleon","Iguana",
    "Snake","Python","Viper","Turtle","Tortoise",
    "Alligator","KomodoDragon","Scorpion","Tarantula",
    "Butterfly","Moth","Bee","Ant","Grasshopper",
    "Beetle","Dragonfly","Mantis","Cockroach","Fly",
    "Mosquito","Wasp","Hornet","Termite","Centipede",
    "Millipede","SeaUrchin","Clam","Oyster","Squilla",
    "Cuttlefish","Seahorse","MorayEel","Angelfish","Clownfish",
    "Goldfish","Catfish","Salmon","Trout","Pike",
    "Bass","Carp","Shad","Eel","Stingray",
    "MantaRay","Swordfish","Marlin","Tuna","Anchovy",
    "Sardine","Herring","Barracuda","Pufferfish","Lionfish",
    "Mackerel","Snapper","Cod","Halibut","Flounder",
    "Plaice","Grouper","Perch","Bluegill","Sunfish",
    "CraneFly","Mayfly","Stonefly","Cicada","GrassSnake",
    "RatSnake","KingCobra","Copperhead","Rattlesnake","GarterSnake",
    "BoaConstrictrix","Anaconda","Vulture","Condor","Albatross",
    "Kiwi","Emu","Cassowary","Ostrich","PenguinKing",
    "PenguinEmperor","PenguinAdelie","PenguinGentoo","PenguinChinstrap","SnowyOwl",
    "BarnOwl","EurasianOwl","LongEaredOwl","ShortEaredOwl","TawnyOwl",
    "RedKite","BlackKite","BaldEagle","GoldenEagle","HarpyEagle",
    "Osprey","Kestrel","Merlin","PeregrineFalcon","GyrFalcon",
    "Sparrow","Robin","BlueJay","Cardinal","Canary",
    "Finch","Warbler","Swallow","Wren","Nightingale",
    "Hummingbird","Kingfisher","Woodpecker","Hornbill","Toucan",
    "Parakeet","Macaw","Cockatoo","Budgerigar","Lorikeet",
    "SeaOtter","RiverOtter","GiantOtter","Mink","Nutria",
    "BeardedSeal","HarpSeal","RingedSeal","LeopardSeal","CrabeaterSeal",
    "WalrusPacific","WalrusAtlantic","Manatee","Dugong","Narwhal",
    "Beluga","Orca","BlueWhale","HumpbackWhale","SpermWhale",
    "FinWhale","MinkeWhale","GrayWhale","BowheadWhale","PilotWhale",
    "Porpoise","DugongIndian","DugongAustralian","SeaCucumber","SeaSlug",
    "OctopusCommon","OctopusGiantPacific","SquidGiant","SquidColossal","CuttlefishCommon",
    "Crayfish","HermitCrab","KingCrab","SnowCrab","SpiderCrab",
    "LobsterAmerican","LobsterEuropean","Scallop","Mussel","OysterPacific",
    "ClamSoftShell","ClamHardShell","SeaAnemone","Coral","JellyfishMoon",
    "JellyfishLionMane","Ctenophore","Hydra","Planarian","Flatworm",
    "Tapeworm","Leech","Earthworm","SegmentedWorm","Nematode",
    "Roundworm","Hookworm","Ascaris","Trichinella","Filaria",
    "Snail","Slug","Nudibranch","Whelk","Conch",
    "Periwinkle","Abalone","Chiton","SeaSlugBlue","SeaSlugRed", "Cattle"
]

model = YOLO("model/best.pt")

def analyze_images(files):

    animal_detected = False
    detected_animals = set()

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
                    class_name = model.names[class_id]

                    if class_name in ANIMAL_CLASSES:
                        animal_detected = True
                        detected_animals.add(class_name)

        except Exception as e:
            print(f"Error processing file: {e}")
            continue

    return {
        "animalDetected": animal_detected,
        "animals": list(detected_animals)
    }
