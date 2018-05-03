<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
<%_ var userTable = options.serverSetup.userTable _%>
<%_ var accountColumn = options.serverSetup.accountColumn _%>
<%_ var passwordColumn = options.serverSetup.passwordColumn _%>
<%_ var database = options.serverSetup.connection.database _%>
package <%-packageAddress%>.<%-moduleName%>.process

import com.simpli.model.EnglishLanguage
import com.simpli.model.RespException
import com.simpli.sql.DaoTest
import com.simpli.tools.SecurityUtils
import <%-packageAddress%>.<%-moduleName%>.response.LoginResp
import <%-packageAddress%>.exception.HttpException
import java.sql.Connection
import java.sql.SQLException
import javax.naming.NamingException
import org.junit.Test
import org.junit.Assert.*

/**
 * Tests the login service
 * @author Simpli© CLI generator
 */
class LoginServiceTest @Throws(NamingException::class, SQLException::class)
constructor() : DaoTest("jdbc/<%-database%>DS", "<%-database%>") {

    private val subject: LoginService
    private val token: String?

    init {
        val con = getConnection()
        val lang = EnglishLanguage()
        val clientVersion = "w1.0.0"
        subject = LoginService(con, lang, clientVersion)
        token = subject.loginToToken("user@gmail.com", SecurityUtils.sha256("abcabc"))
    }

    @Test(expected = HttpException::class)
    fun testAuthFail() {
        subject.auth(null)
    }

    @Test(expected = HttpException::class)
    fun testSignInNull() {
        subject.signIn(null, null)
    }

    @Test(expected = HttpException::class)
    fun testSignInFail() {
        subject.signIn("user@gmail.com", SecurityUtils.sha256("wrongpassword"))
    }

    @Test
    fun testSignInAdmin() {
        val result = subject.signIn("user@gmail.com", SecurityUtils.sha256("abcabc"))
        assertEquals(token,
                result.token)
    }

    @Test(expected = HttpException::class)
    fun testAllowAccessFail() {
        subject.allowAccess("Hey")
    }

    @Test
    fun testAllowAccess() {
        subject.allowAccess(token)
    }

    @Test
    fun testGetIdFail() {
        val result = subject.getId(null, null)
        assertEquals(result, 0)
    }

    @Test
    fun testGetId() {
        val result = subject.getId("user@gmail.com", SecurityUtils.sha256("abcabc"))
        assertNotEquals(result, 0)
    }

    @Test
    fun testTokenToLoginNull() {
        val result = subject.tokenToLogin(null)
        assertNull(result)
    }

    @Test
    fun testTokenToLoginWithTokenNotACoolJson() {
        var tokenOtherObject = SecurityUtils.encrypt("Hey", LoginService.CRIPTOGRAPHY_HASH)

        tokenOtherObject = SecurityUtils.encode(tokenOtherObject!!, "UTF-8")

        val result = subject.tokenToLogin(tokenOtherObject)
        assertNull(result)
    }

    @Test
    fun testLoginToToken() {
        val result = subject.loginToToken("user@gmail.com", SecurityUtils.sha256("abcabc"))
        assertEquals(token,
                result)
    }

    @Test
    fun testLoginHolder() {
        val lh = LoginService.LoginHolder("a", "1")
        assertEquals("a", lh.<%-accountColumn.name%>)
        assertEquals("1", lh.<%-passwordColumn.name%>)
    }

    @Test
    fun testLoginHolderWithId() {
        val lh = LoginService.LoginHolderWithId(LoginService.LoginHolder("a", "1"), 2)
        assertNotNull(lh.loginHolder)
        assertEquals(2, lh.id)
    }

}