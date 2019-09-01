<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
<%_ var userTable = options.serverSetup.userTable _%>
<%_ var accountColumn = options.serverSetup.accountColumn _%>
<%_ var passwordColumn = options.serverSetup.passwordColumn _%>
<%_ var database = options.serverSetup.connection.database _%>
package <%-packageAddress%>.<%-moduleName%>

import <%-packageAddress%>.AppTest
import <%-packageAddress%>.<%-moduleName%>.context.RequestContext
import <%-packageAddress%>.<%-moduleName%>.request.AuthRequest
import <%-packageAddress%>.<%-moduleName%>.response.AuthResponse
import <%-packageAddress%>.app.Env
import <%-packageAddress%>.model.resource.<%-userTable.modelName%>
import br.com.simpli.tools.SecurityUtils.sha256

/**
 * Extended class of handle tests
 * @author Simpli CLI generator
 */
open class ProcessTest: AppTest() {
    protected val context = RequestContext(transacConnector, param)

    protected val <%-userTable.instanceName%> = <%-userTable.modelName%>().apply {
        <%-userTable.idColumn.name%> = Env.props.testerId
        <%-accountColumn.name%> = Env.props.testerLogin
        <%-passwordColumn.name%> = sha256(Env.props.testerPassword)
    }

    protected val authRequest: AuthRequest
    protected val token: String
    protected val auth: AuthResponse

    init {
        authRequest = AuthRequest(<%-userTable.instanceName%>.<%-accountColumn.name%>, <%-userTable.instanceName%>.<%-passwordColumn.name%>)
        token = authRequest.toToken()
        auth = AuthResponse(token, <%-userTable.instanceName%>)
    }
}
