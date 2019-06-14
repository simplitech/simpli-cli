<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.app

import <%-packageAddress%>.app.Cast.builder
import <%-packageAddress%>.app.Env.DATE_FORMAT
import com.google.gson.Gson
import java.io.IOException
import java.lang.reflect.Type
import java.text.ParseException
import java.text.SimpleDateFormat
import java.util.Date
import javax.ws.rs.WebApplicationException
import javax.ws.rs.container.ContainerRequestContext
import javax.ws.rs.container.ContainerResponseContext
import javax.ws.rs.container.ContainerResponseFilter
import javax.ws.rs.ext.ContextResolver
import javax.ws.rs.ext.ParamConverter
import javax.ws.rs.ext.ParamConverterProvider
import javax.ws.rs.ext.Provider

/**
 * App Provider
 * Provides rules of access for all requests
 * @author Simpli CLI generator
 */
@Provider
class AppProvider : ParamConverterProvider, ContextResolver<Gson>, ContainerResponseFilter {

    override fun <T : Any?> getConverter(rawType: Class<T>?, genericType: Type?, annotations: Array<out Annotation>?): ParamConverter<T>? {
        return when (rawType) {
            is Date, Date::class.java -> DateParameterConverter() as ParamConverter<T>
            else -> null
        }
    }

    override fun getContext(type: Class<*>?): Gson {
        return builder
    }

    @Throws(IOException::class)
    override fun filter(request: ContainerRequestContext, response: ContainerResponseContext) {
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
        response.headers.add("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, Accept, X-Client-Version, X-Ignore-Errors, Authorization, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")
    }

    internal class DateParameterConverter : ParamConverter<Date> {
        private val simpleDateFormat = SimpleDateFormat(DATE_FORMAT)

        override fun fromString(str: String): Date? {
            try {
                return if (str.isNotBlank()) simpleDateFormat.parse(str) else null
            } catch (ex: ParseException) {
                throw WebApplicationException(ex)
            }
        }

        override fun toString(date: Date): String {
            return simpleDateFormat.format(date)
        }
    }

}
