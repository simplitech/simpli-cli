<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
<%_ var moduleNameKebabCase = options.serverSetup.kebabCase(moduleName) _%>
<%_ var accountColumn = options.serverSetup.accountColumn _%>
package <%-packageAddress%>.<%-moduleName%>.socket

import <%-packageAddress%>.<%-moduleName%>.context.AuthPipe
import <%-packageAddress%>.app.Env
import <%-packageAddress%>.app.RequestLogger
import <%-packageAddress%>.param.DefaultParam
import <%-packageAddress%>.wrapper.RouterWrapper
import <%-packageAddress%>.wrapper.SocketWrapper
import java.util.logging.Level
import java.util.logging.Logger
import javax.websocket.OnClose
import javax.websocket.OnError
import javax.websocket.OnOpen
import javax.websocket.Session
import javax.websocket.server.PathParam
import javax.websocket.server.ServerEndpoint

/**
 * Notification Web Socket
 * The generic two-way (bi-directional) ongoing conversation between the client and the server
 * @author Simpli CLI generator
 */
@ServerEndpoint("/ws/<%-moduleNameKebabCase%>/notification/{token}")
class NotificationSocket: RouterWrapper() {

    companion object {
        val socket = SocketWrapper<String>()
    }

    @OnOpen
    fun onConnect(session: Session, @PathParam("token") token: String) {
        val param = DefaultParam.Auth()

        param.lang = "en-US"
        param.clientVersion = "ws.auth"
        param.authorization = """Bearer $token"""

        AuthPipe.handle(connectionPipe, param) { _, auth ->
            session.userProperties["token"] = auth.token
            session.userProperties["<%-accountColumn.name%>"] = auth.<%-accountColumn.name%>

            socket.attachSession(session, auth.id)
        }

        if (Env.props.detailedLog) {
            Logger.getLogger(RequestLogger::class.java.name).log(Level.INFO, """
            ===== CLIENT SOCKET CONNECTION ESTABLISHED =====
            CLIENT ID: ${session.userProperties["id"]}
            CLIENT LOGIN: ${session.userProperties["<%-accountColumn.name%>"]}
            =========================================
            """)
        }
    }

    @OnClose
    fun onDisconnect(session: Session) {
        socket.detachSession(session)

        if (Env.props.detailedLog) {
            Logger.getLogger(RequestLogger::class.java.name).log(Level.INFO, """
            ===== CLIENT SOCKET CONNECTION LOST =====
            CLIENT ID: ${session.userProperties["id"]}
            CLIENT LOGIN: ${session.userProperties["<%-accountColumn.name%>"]}
            =========================================
            """)
        }
    }

    @OnError
    fun onError(e: Throwable) {
        toResponse(e)
    }

}
