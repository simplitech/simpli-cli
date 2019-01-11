<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.wrapper

import java.sql.Connection
import br.com.simpli.model.LanguageHolder

/**
 * Process Wrapper
 * Extended class of router processes
 * @author Simpli CLI generator
 */
abstract class ProcessWrapper {
    lateinit var con: Connection
    lateinit var lang: LanguageHolder
    lateinit var clientVersion: String

    open fun onAssign() {/**/}

    fun assign(con: Connection, lang: LanguageHolder, clientVersion: String) {
        this.con = con
        this.lang = lang
        this.clientVersion = clientVersion
        onAssign()
    }
}
