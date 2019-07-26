<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.wrapper

import br.com.simpli.model.LanguageHolder
import br.com.simpli.sql.AbstractConnector

/**
 * Process Wrapper
 * Extended class of router processes
 * @author Simpli CLI generator
 */
abstract class ProcessWrapper {
    lateinit var con: AbstractConnector
    lateinit var lang: LanguageHolder
    lateinit var clientVersion: String

    open fun onAssign() {/**/}

    fun assign(con: AbstractConnector, lang: LanguageHolder, clientVersion: String) {
        this.con = con
        this.lang = lang
        this.con.lang = this.lang
        this.clientVersion = clientVersion
        onAssign()
    }
}
