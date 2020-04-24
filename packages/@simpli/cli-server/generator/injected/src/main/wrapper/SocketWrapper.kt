<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.wrapper

import <%-packageAddress%>.app.Cast.classToJson
import java.nio.ByteBuffer
import javax.websocket.Session

/**
 * Socket Wrapper
 * @author Simpli CLI generator
 */
open class SocketWrapper<C : Any> {
    private var uniqueSession: Session? = null
    private val mappedSession = mutableMapOf<String, Session>()

    fun getSession(id: Any? = null): Session? {
        return if (id != null) {
            mappedSession[id.toString()]
        } else {
            uniqueSession
        }
    }

    fun attachSession(session: Session, id: Any? = null) {
       if (id != null) {
           session.userProperties["id"] = id
           mappedSession[id.toString()] = session
       } else {
           uniqueSession = session
       }
    }

    fun detachSession(session: Session) {
        val id = session.userProperties["id"] as? String?

        if (id != null) {
            mappedSession.remove(id)
        } else {
            uniqueSession = null
        }
    }

    fun send(content: C, id: Any? = null) {
        val session = getSession(id) ?: return

        when (content) {
            is String -> session.basicRemote.sendText(content)
            is ByteBuffer -> session.basicRemote.sendBinary(content)
            else -> session.basicRemote.sendText(classToJson(content))
        }
    }
}
