<%_ var packageAddress = options.serverSetup.packageAddress _%>
package <%-packageAddress%>.locale

import br.com.simpli.model.PortugueseLanguage

/**
 * Brazilian Portuguese language
 * @author Simpli CLI generator
 */
class PtBr : PortugueseLanguage() {
    init {
        dictionary = hashMapOf(
                "email_sender_name" to "Equipe Usecase",
                "email_contact" to "contact@usecase.org",

                "email_reset_password_subject" to "Esqueci minha senha",
                "email_reset_password_title" to "Esqueci minha senha",
                "email_reset_password_subtitle" to "As vezes isso pode acontecer. Não tem problema!",
                "email_reset_password_body" to "",
                "email_reset_password_text_button" to "Se você solicitou o esqueci senha, clique no botão abaixo para criar uma nova.",
                "email_reset_password_label_button" to "Criar nova senha",

                "access_denied" to "Acesso Negado",
                "already_exists" to "Não é possível criar um item já existente",
                "does_not_exist" to "Não é possível editar um item não existente",
                "invalid_token" to "Token Inválido",
                "user_id_not_found" to "ID do Usuário Não Encontrado",
                "user_not_found" to "Usuário Não Encontrado",
                "wrong_password" to "Senha inválida",
                "password_no_match" to "Os campos senha precisam ser iguais",
                "something_went_wrong" to "Algo saiu errado. Contate o admin!"
        )
    }
}
