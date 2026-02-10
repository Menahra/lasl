import polib
import argostranslate.package
import argostranslate.translate
import os

def install_language_pair(from_code, to_code):
    """Installs required language models for Argos Translate."""
    print(f"Checking for model: {from_code} -> {to_code}")
    argostranslate.package.update_package_index()
    available_packages = argostranslate.package.get_available_packages()
    package = next(
        filter(
            lambda x: x.from_code == from_code and x.to_code == to_code,
            available_packages
        )
    )
    # Install if not already installed
    package.install()
    print(f"Model {from_code} -> {to_code} ready.")

def translate_text(text, from_lang, to_lang):
    """Translates text using local model."""
    try:
        return argostranslate.translate.translate(text, from_lang, to_lang)
    except Exception as e:
        print(f"Error translating: {e}")
        return text

def update_po_files():
    source_lang = 'en'
    target_languages = ['de-DE', 'fr-FR']
    source_po_path = 'apps/frontend/src/locales/en-US/messages.po'
    
    if not os.path.exists(source_po_path):
        print("Source file not found.")
        return

    source_po = polib.pofile(source_po_path)

    for lang in target_languages:
        target_path = f'apps/frontend/src/locales/{lang}/messages.po'
        if not os.path.exists(target_path):
            continue
            
        print(f"Processing {target_path}...")
        target_po = polib.pofile(target_path)
        
        # Install model for this pair
        install_language_pair(source_lang, lang)
        
        updated = False
        for entry in source_po:
            # Find corresponding entry in target file
            target_entry = target_po.find(entry.msgid)
            
            # If entry exists and is empty or fuzzy, translate it
            if target_entry and (target_entry.msgstr == "" or "fuzzy" in target_entry.flags):
                print(f"Translating: {entry.msgid}")
                translation = translate_text(entry.msgid, source_lang, lang)
                target_entry.msgstr = translation
                # Remove fuzzy flag
                if "fuzzy" in target_entry.flags:
                    target_entry.flags.remove("fuzzy")
                updated = True
        
        if updated:
            target_po.save()
            print(f"Saved {target_path}")

if __name__ == "__main__":
    update_po_files()
