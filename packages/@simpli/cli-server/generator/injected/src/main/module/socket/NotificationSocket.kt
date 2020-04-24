<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
<%_ var moduleNameKebabCase = options.serverSetup.kebabCase(moduleName) _%>
<%_ var accountColumn = options.serverSetup.accountColumn _%>
package <%-packageAddress%>.<%-moduleName%>.socket

import <%-packageAddress%>.<%-moduleName%>.context.AuthPipe
import <%-packageAddress%>.enums.ConnectionStatus
import <%-packageAddress%>.extension.jsonProperties
import <%-packageAddress%>.model.param.DefaultParam
import <%-packageAddress%>.wrapper.RouterWrapper
import <%-packageAddress%>.wrapper.SocketWrapper
import javax.websocket.OnClose
import javax.websocket.OnError
import javax.websocket.OnOpen
import javax.websocket.Session
import javax.websocket.server.PathParam
import javax.websocket.server.ServerEndpoint
import org.apache.logging.log4j.LogManager

/**
 * Notification Web Socket
 * The generic two-way (bi-directional) ongoing conversation between the client and the server
 * @author Simpli CLI generator
 */
@ServerEndpoint("/ws/<%-moduleNameKebabCase%>/notification/{token}")
class NotificationSocket: RouterWrapper() {
    companion object {
        val socket = SocketWrapper<String>()

        private val logger = LogManager.getLogger(NotificationSocket::class.java)
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

        logger.debug(session.jsonProperties(ConnectionStatus.ESTABLISHED))
    }

    @OnClose
    fun onDisconnect(session: Session) {
        socket.detachSession(session)

        logger.debug(session.jsonProperties(ConnectionStatus.LOST))
    }

    @OnError
    fun onError(e: Throwable) {
        toResponse(e)
    }
}
