exports.passwordUpdated = (name, resetDate) => {
    return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Update Confirmation</title>
    <link href="https://fonts.googleapis.com/css?family=Raleway:400,700&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f9f9ff;
            font-family: 'Raleway', sans-serif;
            color: #000;
            text-align: center;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
        }

        h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 20px;
        }

        p {
            font-size: 16px;
            margin-bottom: 20px;
        }

        .footer {
            text-align: center;
            font-size: 14px;
            margin-top: 30px;
        }

        .footer a {
            color: #1386e5;
            text-decoration: underline;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>Password Successfully Updated</h1>
        <p>Hey ${name},</p>
        
        <p>Your password for your ShortZoid account has been successfully updated. If you made this change, no further action is required.</p>

        <h4>Request Details:</h4>
        <p>Date and Time of Request: ${resetDate}</p>
        
        <p>If you did not request this change, please contact our support team immediately to secure your account.</p>
        
        <p>For security, we recommend that you do not share your password with anyone.</p>
    </div>
    <div class="footer">
        <p>ShortZoid - a URL Shortener &amp; QR Code Generator</p>
        <p>Made with ❤ by <a href="https://www.linkedin.com/in/pulkitgarg04/" target="_blank">Pulkit Garg</a></p>
    </div>
</body>

</html>`;
};