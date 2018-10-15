<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.lang

import br.com.simpli.model.EnglishLanguage

class EnUs : EnglishLanguage() {

    init {
        dictionary = hashMapOf(
                "sample_message" to "Sample Message"
        )
    }
}