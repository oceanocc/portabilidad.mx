$(function()
{

    // Smooth scrolling
    $('a[href*="#"]').on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top - 70
        }, 500);
    });
    
    // Navbar background on scroll
    $(window).scroll(function() {
        if ($(window).scrollTop() > 50) {
            $('.navbar').addClass('bg-movistar-dark');
        } else {
            $('.navbar').removeClass('bg-movistar-dark');
        }
    });

    // Form validation and submission
    $('#portability-form').submit(async function(e)
    {
        e.preventDefault();
        
        // Clear previous notifications
        $('#notifications').html('');
        
        // Basic validation
        let isValid = true;
        $(this).find('[required]').each(function() {
            if (!$(this).val()) {
                $(this).addClass('is-invalid');
                isValid = false;
            } else {
                $(this).removeClass('is-invalid');
            }
        });

        // Telephone validation
        const regexNumeros = /^\d{10}$/;
        if (regexNumeros.test($('#telefono').val()) === false)
        {
            $('#telefono').addClass('is-invalid');
            isValid = false;
        }
        if (!isValid)
        {
            showNotification('Por favor complete todos los campos requeridos de manera correcta.', 'warning');
            return;
        }
        
        // Prepare form data
        const nombre_completo = $('#nombre_completo').val();
        const telefono = $('#telefono').val();
        const operadora = $('#operadora').val();
        const formData =
        {
            nombre_completo: nombre_completo,
            telefono: telefono,
            operadora: operadora
        };
        
        const submitBtn = $(this).find('button[type="submit"]');

        try
        {
            // Show loading state
            submitBtn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> Enviando...');
            
            // Send data to server
            const response = await fetch('https://hook.us2.make.com/yh2khdcpx6sw46pfj7tbgy5wpis5x1dl',
            {
                method: 'POST',
                headers:
                {
                    'Content-Type': 'application/json',
                    'x-make-apikey': 'UNs3EdtP5m3ocFY'
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok)
            {
                showNotification('Error al enviar el formulario', 'warning');
                submitBtn.prop('disabled', false).html('Enviar Registro');
                location.href="#notifications";
                return;
            }
            
            // Success case
            showNotification('Formulario enviado. Nos pondremos en contacto contigo pronto.', 'success');
            $('#portability-form').hide();
            location.href="#contacto";
            //$(this).trigger('reset');

            const mensaje = encodeURIComponent(`Hola, soy ${nombre_completo} y me gustaría cambiarme a Movistar conservando mi número ${telefono}. Mi operadora actual es ${operadora}.`);
            const whatsappUrl = `https://wa.me/529995122716?text=${mensaje}`;
            window.open(whatsappUrl, '_blank');
            
        }
        catch (error)
        {
            //console.error('Error:', error);
            showNotification('Error de conexión. Por favor intente nuevamente más tarde.', 'warning');
            location.href="#notifications";
        }
        finally
        {
            submitBtn.prop('disabled', false).html('Enviar Registro');
        }
    });

    // Function to show notifications
    function showNotification(message, type = 'warning')
    {
        const notificationDiv = $('#notifications');
        notificationDiv.append($(`<div class="alert alert-${type}">${message}</div>`));
        location.href="#notifications";
    }
});
