import polib
import argostranslate.package
import argostranslate.translate
import os

LOCALE_MAP = {
    'en-US': 'en',
    'fr-FR': 'fr',
    'de-DE': 'de'
}

def install_language_pair(from_code, to_code):
    """Installs required language models for Argos Translate."""
    print(f"Checking for model: {from_code} -> {to_code}")
    
    argostranslate.package.update_package_index()
    available_packages = argostranslate.package.get_available_packages()
    
    package = next(
        filter(
            lambda x: x.from_code == from_code and x.to_code == to_code,
            available_packages
        ),
        None
    )
    
    if package:
        print(f"Installing model {from_code} -> {to_code}...")
        package.install()
        print(f"Model {from_code} -> {to_code} ready.")
    else:
        print(f"ERROR: No model found for {from_code} -> {to_code}")
        return False
    return True

def translate_text(text, from_lang, to_lang):
    """Translates text using local model."""
    try:
        return argostranslate.translate.translate(text, from_lang, to_lang)
    except Exception as e:
        print(f"Error translating: {e}")
        return text

def update_po_files():
    source_bcp47 = 'en-US'
    target_bcp47_list = ['fr-FR', 'de-DE']
    base_path = 'apps/frontend/src/locales'

    source_po_path = os.path.join(base_path, source_bcp47, 'messages.po')
    
    if not os.path.exists(source_po_path):
        print(f"Source file not found at {source_po_path}")
        return

    source_po = polib.pofile(source_po_path, wrapwidth=99999999)

    for target_bcp47 in target_bcp47_list:
        target_path = os.path.join(base_path, target_bcp47, 'messages.po')
        if not os.path.exists(target_path):
            print(f"Target file not found: {target_path}")
            continue
            
        print(f"Processing {target_path}...")
        target_po = polib.pofile(target_path)
        
        argos_from = LOCALE_MAP.get(source_bcp47, source_bcp47)
        argos_to = LOCALE_MAP.get(target_bcp47, target_bcp47)
        
        if not install_language_pair(argos_from, argos_to):
            continue
        
        updated = False
        for entry in source_po:
            target_entry = target_po.find(entry.msgid)
            
            if target_entry and (target_entry.msgstr == "" or "fuzzy" in target_entry.flags):
                print(f"Translating: {entry.msgid}")
                translation = translate_text(entry.msgid, argos_from, argos_to)
                target_entry.msgstr = translation
                
                if "fuzzy" in target_entry.flags:
                    target_entry.flags.remove("fuzzy")
                updated = True
        
        if updated:
            target_po.save()
            print(f"Saved {target_path}")

if __name__ == "__main__":
    update_po_files()
