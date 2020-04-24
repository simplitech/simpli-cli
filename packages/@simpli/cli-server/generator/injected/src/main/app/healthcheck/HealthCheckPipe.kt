<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.app.healthcheck

import br.com.simpli.sql.AbstractConPipe
import br.com.simpli.sql.AbstractConnector

/**
 * Public Pipe
 * Responsible to control the data which is entering into the server
 * @author Simpli CLI generator
 */
object HealthCheckPipe {
    fun <T> handle(
            conPipe: AbstractConPipe,
            callback: (con: AbstractConnector) -> T
    ): T {
        return conPipe.handle {
            callback(it)
        }
    }
}
