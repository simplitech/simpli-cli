<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
<%_ var userTable = options.serverSetup.userTable _%>
<%_ var accountColumn = options.serverSetup.accountColumn _%>
<%_ var passwordColumn = options.serverSetup.passwordColumn _%>
<%_ var database = options.serverSetup.connection.database _%>
package <%-packageAddress%>.<%-moduleName%>

import <%-packageAddress%>.AppTest
import <%-packageAddress%>.<%-moduleName%>.request.AuthRequest
import <%-packageAddress%>.<%-moduleName%>.response.AuthResponse
import <%-packageAddress%>.app.Env.TESTER_ID
import <%-packageAddress%>.app.Env.TESTER_LOGIN
import <%-packageAddress%>.app.Env.TESTER_PASSWORD
import <%-packageAddress%>.model.<%-userTable.modelName%>
import br.com.simpli.tools.SecurityUtils.sha256

/**
 * Extended class of handle tests
 * @author Simpli CLI generator
 */
open class ProcessTest: AppTest() {
    protected val <%-userTable.instanceName%> = <%-userTable.modelName%>()

    init {
        <%-userTable.instanceName%>.<%-userTable.idColumn.name%> = TESTER_ID
        <%-userTable.instanceName%>.<%-accountColumn.name%> = TESTER_LOGIN
        <%-userTable.instanceName%>.<%-passwordColumn.name%> = sha256(TESTER_PASSWORD)
    }

    protected val authRequest = AuthRequest(<%-userTable.instanceName%>.<%-accountColumn.name%>, <%-userTable.instanceName%>.<%-passwordColumn.name%>)
    protected val token = authRequest.toToken()
    protected val auth = AuthResponse(token, <%-userTable.instanceName%>)
}
