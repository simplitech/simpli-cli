<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.extension

import javax.servlet.http.HttpServletRequest

fun HttpServletRequest.ip(): String {
    return getHeader("x-forwarded-for") ?: remoteAddr
}

fun HttpServletRequest.forwarded(): Boolean {
    return !getHeader("x-forwarded-for").isNullOrEmpty()
}
