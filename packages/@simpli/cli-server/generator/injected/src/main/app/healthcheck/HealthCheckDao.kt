<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.app.healthcheck

import br.com.simpli.sql.AbstractConnector
import br.com.simpli.sql.Query
import java.util.Date

/**
 * Data Access Object of Health Check
 * @author Simpli CLI generator
 */
class HealthCheckDao(val con: AbstractConnector) {
    fun getDate(): Date? {
        val query = Query().selectRaw("NOW()")
        return con.getFirstDate(query)
    }
}
