exports.otpTemplate = (otp, name) => {
    return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Email Verification</title>
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
        <h1>OTP Email Verification</h1>
      <p>Hey ${name}</p>
      
      <p>Thank you for choosing ShortZoid. Use the following OTP to complete the procedure to verify your email address. OTP is valid for <strong>30 minutes</strong>. Do not share this code with others.</p>
      <h2>${otp}</h2>
        <p>If you have not signed up, you can safely ignore this.</p>
    </div>
    <div class="footer">
        <p>ShortZoid - a URL Shortener &amp; QR Code Generator</p>
        <p>Made with ❤ by <a href="https://www.linkedin.com/in/pulkitgarg04/" target="_blank">Pulkit Garg</a></p>
    </div>
</body>

</html>`;
};