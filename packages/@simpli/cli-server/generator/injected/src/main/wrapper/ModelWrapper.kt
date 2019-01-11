<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.wrapper

import br.com.simpli.model.LanguageHolder
import br.com.simpli.sql.Dao
import javax.ws.rs.BadRequestException

/**
 * Model Wrapper
 * Extended class of models
 * @author Simpli CLI generator
 */
abstract class ModelWrapper<D : Dao> {
    @Throws(BadRequestException::class)
    abstract fun validate(updating: Boolean, dao: D, lang: LanguageHolder)
}
