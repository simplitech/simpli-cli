<%_ var packageAddress = options.serverSetup.packageAddress _%>
<%_ var moduleName = options.serverSetup.moduleName _%>
package <%-packageAddress%>.<%-moduleName%>.context

import <%-packageAddress%>.app.Facade.Env
import <%-packageAddress%>.enums.Lang
import <%-packageAddress%>.locale.EnUs
import <%-packageAddress%>.model.filter.ListFilter
import <%-packageAddress%>.model.param.DefaultParam
import br.com.simpli.model.LanguageHolder
import br.com.simpli.sql.AbstractConnector

/**
 * Request Context
 * Responsible to validate the request
 * @author Simpli CLI generator
 */
 open class RequestContext(val con: AbstractConnector, param: DefaultParam) {
     val lang: LanguageHolder = Env.AVAILABLE_LANGUAGES[Lang.from(param.lang)] ?: EnUs()
     val clientVersion: String = param.clientVersion

     init {
         when (param) {
             is ListFilter -> {
                 param.query = param.query?.replace("[.,:\\-/]".toRegex(), "")
             }
         }
     }
 }
