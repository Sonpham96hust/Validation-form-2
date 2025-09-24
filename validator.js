function Validator(formSelector){
    var formRules = {};

    /**
     * Quy ước tạo rule:
     * - Nếu có lỗi thì return `error message`
     * - Nếu không có lỗi thì return `undefined`
     */
    var validatorRules = {
        required: function(value){
            return value ? undefined : 'Vui lòng nhập trường này';
        },
        email: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Vui lòng nhập email';
        },
        min: function(min){
            return function (value){
                return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} ký tự`
            }
        }
    }
    var formElement = document.querySelector(formSelector)

    // Chỉ xử lý khi có element
    if (formElement){
        var inputs = formElement.querySelectorAll('[name][rules]');
        inputs.forEach(function (input){
            var rules = input.getAttribute('rules').split('|')
            rules.forEach(function(rule){
                var isRuleHasValue= rule.includes(':')
                if (isRuleHasValue){
                    var ruleinfo = rule.split(':')
                    rule = ruleinfo[0];
                }

                var ruleFunc = validatorRules[rule];
                if (isRuleHasValue)
                {
                    ruleFunc = ruleFunc(ruleinfo[1]);
                }
            if (Array.isArray(formRules[input.name])){
                formRules[input.name].push(ruleFunc)
            }else
            {
                formRules[input.name] = [ruleFunc]
            }


            })
            
        // Lắng nghe events để validate (blur, onchange,...)
            input.onblur = handleValidate;

        // Hàm thực hiện validate
        function handleValidate(event){
            var rules = formRules[event.target.name]
            var errorMessage;
            rules.forEach(function(rule){
                if (!errorMessage) {  // Chỉ kiểm tra lỗi nếu chưa có lỗi
                errorMessage = rule(event.target.value);
    }
            });
            console.log(errorMessage)
        }

        })
       // console.log(formRules)
    }
}