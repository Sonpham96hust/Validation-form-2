function Validator(formSelector){
    // Gán giá trị mặc định cho tham số ES5
    var _this =this;

    var formRules = {};

    function getParent(element, selector){
        while(element.parentElement){
            if (element.parentElement.matches(selector)){
                return element.parentElement
            }else{
                element = element.parentElement
            }
        }
    }


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
            input.oninput = hanleClearError;

        // Hàm thực hiện validate
        function handleValidate(event){
            var rules = formRules[event.target.name]
            var errorMessage;
            rules.forEach(function(rule){
                if (!errorMessage) {  // Chỉ kiểm tra lỗi nếu chưa có lỗi
                errorMessage = rule(event.target.value);
    }
            });
            // Nếu có lỗi thì hiển thị lỗi qua UI
            if (errorMessage){
              var formGroup =  getParent(event.target, '.form-group')
              if (formGroup){
                formGroup.classList.add('invalid')
                var formMessage = formGroup.querySelector('.form-message')
                if(formMessage){
                    formMessage.innerText = errorMessage;
                }
              }
            }
            return !errorMessage;
        }
        //Hàm clear message lỗi
        function hanleClearError(event){
            var formGroup =  getParent(event.target, '.form-group')
            if (formGroup.classList.contains('invalid')){
                formGroup.classList.remove('invalid')
            }
            var formMessage = formGroup.querySelector('.form-message')
            if(formMessage){
                    formMessage.innerText = '';
                }
        }
        //Xử lý hành vi submit form
        formElement.onsubmit = function(e)
        {
            e.preventDefault();
            var inputs = formElement.querySelectorAll('[name][rules]');
            var isValid = true;
            inputs.forEach(function (input){
                if (!handleValidate({target: input})){
                    isValid = false;
                }
        })
        if (isValid){
            if(typeof _this.onSubmit === 'function'){
            var enableInputs = formElement.querySelectorAll('[name]')
            var formValue = Array.from(enableInputs).reduce(function (result, input){
                    switch(input.type){
                        case 'radio':
                        result[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                        break;
                        case 'checkbox':
                            if(!input.matches(':checked')) {
                                value[input.name] = '';
                                return result
                            }
                            if(!Array.isArray(result[input.name])){
                                result[input.name]=[];
                            }
                            result[input.name].push(input.value)
                        break;
                        default:
                        result[input.name] = input.value ;
                    }
                    
                    
                    return result;
                }, {});
                _this.onSubmit(formValue);
                
            }
            else{
                formElement.submit();
            }
        }

        }
    })
       
    }
}