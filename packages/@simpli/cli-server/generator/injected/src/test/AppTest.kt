<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>

import <%-packageAddress%>.app.Env.DS_NAME
import <%-packageAddress%>.app.Env.TESTER_CLIENT_VERSION
import <%-packageAddress%>.app.Env.TESTER_DATABASE
import br.com.simpli.model.EnglishLanguage
import br.com.simpli.sql.DaoTest
import java.sql.SQLException
import javax.naming.NamingException

/**
 * Extended class of database connector tests
 * @author Simpli CLI generator
 */
open class AppTest @Throws(NamingException::class, SQLException::class)
constructor() : DaoTest(DS_NAME, TESTER_DATABASE) {
    protected val con = getConnection()
    protected val lang = EnglishLanguage()
    protected val clientVersion = TESTER_CLIENT_VERSION
}
