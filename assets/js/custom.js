$(document).ready(function() {

    // enable toggle accordion when this block all field has value
    $('body').on('click', '.bbopc_inputs_filled .accdr_title', function(){
        $(this).next().toggle();
    });


    // check all input fields
    $('.bbopc_form_col').each(function(index) {
        let $inputs = $(this).find('.bbopc_inputf');
        
        // Listen to the blur event, which triggers when the input loses focus
        $inputs.on('blur change', function() {
            checkAllBlocks(); 
            let $input = $(this);
            
            // Check if the input has at least two characters
            if (hasMinimumTwoCharacters($input.val())) {
                $input.parent('.text-field').addClass('inp_ok');
            } else {
                $input.parent('.text-field').removeClass('inp_ok');
            }
            
            // Check if all inputs are filled to show the next block
            if (allInputsFilled($inputs)) {
                $('.bbopc_fc_' + (index + 2)).removeClass('hidden');
                $('.bbl_step_' + (index + 1)).addClass('bbl_completed');
                $('.bbl_step_' + (index + 2)).addClass('bbl_active');
                $('.bbopc_fc_' + (index + 1)).addClass('bbopc_inputs_filled hidden');
            }
        });
    });

    function allInputsFilled($inputs) {
        let filled = true;
        $inputs.each(function() {
            if (!hasMinimumTwoCharacters($(this).val())) {
                filled = false;
            }
        });
        return filled;
    }

    // Check if the input value contains at least two characters
    function hasMinimumTwoCharacters(value) {
        return value.trim().length >= 2;
    }


    // Function check if all fields are filled
    function checkAllBlocks() {
        let allBlocksFilled = true;

        // Loop through all blocks to ensure all inputs are filled
        $('.bbopc_form_col').each(function() {
            let $inputs = $(this).find('.bbopc_inputf');
            if (!allInputsFilled($inputs)) {
                allBlocksFilled = false;
                return false; // Exit loop if any block is not filled
            }
        });

        // Enable or disable the submit link based on whether all blocks are filled
        if (allBlocksFilled) {
            $('#bbopc_submit').removeClass('disabled');
        } else {
            $('#bbopc_submit').addClass('disabled');
        }
    }



    // Enable Billing info as Previous
    let $pf_inputs = $('#address, #city, #state, #zip');
    $pf_inputs.on('blur change', function() {
       sameAsPrevious();
    });

    $('#sameAsPrevious').on('change', function() {
        sameAsPrevious();
    });

    function sameAsPrevious() {
        if ($('#sameAsPrevious').is(':checked')) {
            $('#billing-address').val($('#address').val());
            $('#billing-city').val($('#city').val());
            $('#billing-state').val($('#state').val());
            $('#billing-zip').val($('#zip').val());

            // Trigger the blur event to show the checkmarks if necessary
            $('#billing-address, #billing-city, #billing-state, #billing-zip').blur().parent('.text-field').addClass('typing');

            // if has previus field value then hide billing block
            $('.billing_fields').addClass('hidden');
        } else {
            // Optionally, you can clear the billing fields if the checkbox is unchecked
            $('#billing-address, #billing-city, #billing-state, #billing-zip').val('').parent('.text-field').removeClass('typing inp_ok');
            jQuery(this).parents('.bbopc_form_col').removeClass('bbopc_inputs_filled');

            // if has previus field value then show billing block
            $('.billing_fields').removeClass('hidden');
        }        
    }


    // Label on the top
    $('.bbopc_inputf').on('input', function() {
        if ($(this).val()) {
            $(this).parent('.text-field').addClass('typing');
        }
    });

    $('.bbopc_inputf').on('focusout', function() {
        if (!$(this).val()) {
            $(this).parent('.text-field').removeClass('typing');
        }
    });



    // date picker full width clickable    
    $('#datepicker').on('click focus', function() { 
        this.showPicker();
    });

    $('#datepicker').on('change', function() { 
        $('#depdn_date').removeClass('hidden');
        var date          = $(this).val();
        var parts         = date.split("-");
        var formattedDate = parts[1] + "/" + parts[2] + "/" + parts[0];
        $('#selected_dateval').text( formattedDate );
        console.log( formattedDate );
    });

    $('.radio-item input').on('change', function() { 
        $('#depdn_covers').removeClass('hidden');
        var radio_cover = $(this).siblings('label').find('.radio_cover').text();
        var radio_mo    = $(this).siblings('label').find('.radio_mo').text();
        $('#selected_cover').text( radio_cover );
        $('#selected_mo').text( radio_mo );
        console.log('radioVal = ' + radio_cover, radio_mo);
    });




    // Stycky Due Bill
    var $stickySection = $('.bbopc_totalduebb_wrap');
    var stickyTop      = $stickySection.offset().top;
    
    $(window).scroll(function() {
        var bbopc_page_end = $('#bbopc_page_end').offset().top;
        var $scroll_top = $(window).scrollTop();
        if ( $scroll_top > stickyTop && $scroll_top < ( bbopc_page_end - $(window).height() ) ) {
            $stickySection.addClass('bill_fixed');
        } else {
            $stickySection.removeClass('bill_fixed');
        }
    });




    /**
     * Input Field Formating
     * 
     */
    // Formating Phone Field as (XXX) XXX-XXXX
    $('#phone').on('input', function() {
        let input = $(this).val().replace(/\D/g, ''); // Remove all non-numeric characters

        // Apply formatting
        if (input.length > 0) input = '(' + input;
        if (input.length > 3) input = input.slice(0, 4) + ') ' + input.slice(4);
        if (input.length > 6) input = input.slice(0, 9) + '-' + input.slice(9);

        // Limit to 10 digits and update the field
        $(this).val(input.slice(0, 14));
    });


    // Credit Card Number Validation, Formatting, and Card Type Detection
    $('#ccard').on('input', function() {
        let input = $(this).val().replace(/\D/g, '').slice(0, 16); // Allow only digits, max 16
        input = input.match(/.{1,4}/g)?.join(' ') || input; // Format as XXXX XXXX XXXX XXXX
        $(this).val(input);

        // Detect card type based on the starting digits and add the corresponding class
        let cardType = getCardType(input);
        $(this).parent('.text-field').removeClass('c_visa c_mastercard c_amex c_discover').addClass(cardType);
    });

    // Expiration Date Validation and Formatting
    $('#expd').on('input', function() {
        let input = $(this).val().replace(/\D/g, '').slice(0, 4); // Allow only digits, max 4 (MMYY)
        if (input.length >= 3) input = input.slice(0, 2) + '/' + input.slice(2); // Add slash after MM
        $(this).val(input);
    });

    // CVV/CVC Validation
    $('#cvv').on('input', function() {
        let input = $(this).val().replace(/\D/g, '').slice(0, 4); // Allow only digits, max 4
        $(this).val(input);
    });

    // Function to detect the card type based on the starting digits
    function getCardType(number) {
        if (/^4/.test(number)) return 'c_visa';
        if (/^5/.test(number)) return 'c_mastercard';
        if (/^3[47]/.test(number)) return 'c_amex';
        if (/^6/.test(number)) return 'c_discover';
        return ''; // Return empty if no match
    }

});
