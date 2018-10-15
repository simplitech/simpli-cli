<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.lang

import br.com.simpli.model.PortugueseLanguage

class PtBr : PortugueseLanguage() {

    init {
        dictionary = hashMapOf(
                "sample_message" to "Mensagem de exemplo"
        )
    }
}