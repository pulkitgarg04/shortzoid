exports.forgetPasswordTemplate = (link, name) => {
    return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password</title>
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

        img {
            max-width: 35%;
            height: auto;
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

        a.button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 14px;
            color: #000;
            background-color: #fdb441;
            border-radius: 25px;
            text-decoration: none;
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
        <h1>Forget your password?</h1>
        <p>Dear ${name}, If you've lost your password or wish to reset it, click the button below to get started:</p>
        <a href="${link}" class="button">Reset Your Password</a>
        <p>If you're facing any problem using button, try clicking on the link below:</p>
        <a href="${link}">${link}</a>
        <p>If you did not request a password reset, you can safely ignore this.</p>
    </div>
    <div class="footer">
        <p>ShortZoid - a URL Shortener &amp; QR Code Generator</p>
        <p>Made with ❤ by <a href="https://www.linkedin.com/in/pulkitgarg04/" target="_blank">Pulkit Garg</a></p>
    </div>
</body>

</html>`;
};