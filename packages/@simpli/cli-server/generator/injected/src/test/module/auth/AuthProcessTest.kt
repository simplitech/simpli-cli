<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
package <%-packageAddress%>.<%-moduleName%>.auth

import <%-packageAddress%>.<%-moduleName%>.ProcessTest
import <%-packageAddress%>.<%-moduleName%>.request.AuthRequest
import <%-packageAddress%>.<%-moduleName%>.request.ChangePasswordRequest
import <%-packageAddress%>.app.Env.TESTER_LOGIN
import <%-packageAddress%>.app.Env.TESTER_PASSWORD
import <%-packageAddress%>.exception.response.BadRequestException
import <%-packageAddress%>.exception.response.NotFoundException
import <%-packageAddress%>.exception.response.UnauthorizedException
import br.com.simpli.tools.SecurityUtils.sha256
import org.junit.Test
import kotlin.test.assertEquals

/**
 * Tests the login service
 * @author Simpli CLI generator
 */
class AuthProcessTest : ProcessTest() {

    private val unauthorizedRequest = AuthRequest(TESTER_LOGIN, "wrongpassword")
    private val subject = AuthProcess()

    init {
       subject.assign(con, lang, clientVersion)
    }

    @Test(expected = UnauthorizedException::class)
    fun testAuthFail() {
        subject.auth("invalidtoken")
    }

    @Test
    fun testAuth() {
        subject.auth(token)
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
                sha256(TESTER_PASSWORD),
                sha256("""${TESTER_PASSWORD}new"""),
                sha256("""${TESTER_PASSWORD}new""")
        )

        val result = subject.changePassword(request, auth)
        assertEquals(1L, result)
    }

    @Test(expected = BadRequestException::class)
    fun testChangePasswordWrongPassword() {
        val request = ChangePasswordRequest(
                sha256("wrongpassword"),
                sha256("""${TESTER_PASSWORD}new"""),
                sha256("""${TESTER_PASSWORD}new""")
        )

        subject.changePassword(request, auth)
    }

    @Test(expected = BadRequestException::class)
    fun testChangePasswordPasswordNoMatch() {
        val request = ChangePasswordRequest(
                sha256(TESTER_PASSWORD),
                sha256("""${TESTER_PASSWORD}new"""),
                sha256("""${TESTER_PASSWORD}different""")
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
        assertEquals(user.idUserPk, result)
    }

    @Test(expected = NotFoundException::class)
    fun testGetUserNotFound() {
        subject.getUser(0)
    }

    @Test
    fun testGetUser() {
        val result = subject.getUser(user.idUserPk)
        assertEquals(user.email, result.email)
    }

    @Test
    fun testRequestToToken() {
        val result = AuthProcess.requestToToken(authRequest)
        assertEquals(token, result)
    }

    @Test
    fun testTokenToRequest() {
        val result = AuthProcess.tokenToRequest(token)
        assertEquals(user.email, result.email)
    }
}