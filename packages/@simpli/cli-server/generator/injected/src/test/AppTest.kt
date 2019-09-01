<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>

import <%-packageAddress%>.app.Env
import <%-packageAddress%>.param.DefaultParam
import br.com.simpli.sql.DaoTest
import br.com.simpli.sql.TransacConnector

/**
 * Extended class of database connector tests
 * @author Simpli CLI generator
 */
open class AppTest : DaoTest(Env.props.dsName, Env.props.testerDatabase) {
    protected val transacConnector = TransacConnector(getConnection())
    protected val param = DefaultParam()
}
