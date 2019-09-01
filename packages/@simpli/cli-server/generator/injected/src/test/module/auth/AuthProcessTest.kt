<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
<%_ var userTable = options.serverSetup.userTable _%>
<%_ var accountColumn = options.serverSetup.accountColumn _%>
package <%-packageAddress%>.<%-moduleName%>.auth

import <%-packageAddress%>.<%-moduleName%>.ProcessTest
import <%-packageAddress%>.<%-moduleName%>.request.AuthRequest
import <%-packageAddress%>.<%-moduleName%>.request.ChangePasswordRequest
import <%-packageAddress%>.app.Env
import <%-packageAddress%>.exception.response.BadRequestException
import <%-packageAddress%>.exception.response.NotFoundException
import <%-packageAddress%>.exception.response.UnauthorizedException
import <%-packageAddress%>.param.DefaultParam
import br.com.simpli.tools.SecurityUtils.sha256
import org.junit.Test
import kotlin.test.assertEquals

/**
 * Tests the login service
 * @author Simpli CLI generator
 */
class AuthProcessTest : ProcessTest() {
    private val unauthorizedRequest = AuthRequest(Env.props.testerLogin, "wrongpassword")
    private val subject = AuthProcess(context)

    @Test(expected = UnauthorizedException::class)
    fun testAuthFail() {
        val param = DefaultParam.Auth()
        param.authorization = "invalidtoken"
        subject.authenticate(param)
    }

    @Test
    fun testAuth() {
        val param = DefaultParam.Auth()
        param.authorization = "Bearer $token"
        subject.authenticate(param)
    }

    @Test(expected = UnauthorizedException::class)
    fun testSignInFail() {
        subject.signIn(unauthorizedRequest)
    }

    @Test
    fun testSignIn() {
        val result = subject.signIn(authRequest)
        assertEquals(token, result.token)
    }

    @Test
    fun testChangePassword() {
        val request = ChangePasswordRequest(
                sha256(Env.props.testerPassword),
                sha256("""${Env.props.testerPassword}new"""),
                sha256("""${Env.props.testerPassword}new""")
        )

        val result = subject.changePassword(request, auth)
        assertEquals(1L, result)
    }

    @Test(expected = BadRequestException::class)
    fun testChangePasswordWrongPassword() {
        val request = ChangePasswordRequest(
                sha256("wrongpassword"),
                sha256("""${Env.props.testerPassword}new"""),
                sha256("""${Env.props.testerPassword}new""")
        )

        subject.changePassword(request, auth)
    }

    @Test(expected = BadRequestException::class)
    fun testChangePasswordPasswordNoMatch() {
        val request = ChangePasswordRequest(
                sha256(Env.props.testerPassword),
                sha256("""${Env.props.testerPassword}new"""),
                sha256("""${Env.props.testerPassword}different""")
        )

        subject.changePassword(request, auth)
    }

    @Test(expected = NotFoundException::class)
    fun testGetIdNotFound() {
        subject.getId(unauthorizedRequest)
    }

    @Test
    fun testGetId() {
        val result = subject.getId(authRequest)
        assertEquals(<%-userTable.instanceName%>.id, result)
    }

    @Test(expected = NotFoundException::class)
    fun testGet<%-userTable.modelName%>NotFound() {
        subject.get<%-userTable.modelName%>(0)
    }

    @Test
    fun testGet<%-userTable.modelName%>() {
        val result = subject.get<%-userTable.modelName%>(<%-userTable.instanceName%>.id)
        assertEquals(<%-userTable.instanceName%>.<%-accountColumn.name%>, result.<%-accountColumn.name%>)
    }

    @Test
    fun testRequestToToken() {
        val result = AuthProcess.requestToToken(authRequest)
        assertEquals(token, result)
    }

    @Test
    fun testTokenToRequest() {
        val result = AuthProcess.tokenToRequest(token)
        assertEquals(<%-userTable.instanceName%>.<%-accountColumn.name%>, result.<%-accountColumn.name%>)
    }
}
