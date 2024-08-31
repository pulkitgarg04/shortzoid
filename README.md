# ShortZoid

ShortZoid is a powerful tool designed to simplify the process of shortening URLs while providing advanced tracking capabilities. Whether you’re a marketer, developer, or everyday user, ShortZoid helps you manage and analyze your links with ease.

### Features
- **Effortless URL Shortening**: Instantly create shortened URLs for easy sharing.
- **QR Code Generation**: Generate QR codes for any shortened link to enhance offline sharing.
- **Comprehensive Analytics**: Track clicks, devices, and browsers with detailed visit history.
- **User-friendly Dashboard**: Access and manage all your shortened URLs in one intuitive interface.

### Tech Stack
- Backend: Node.js (Express.js)
- Frontend: EJS (Embedded JavaScript)
- Database: MongoDB

### Prerequisites
Before you begin, ensure you have the following installed:

- Node.js (14+)
- MongoDB Atlas
- npm or yarn

### Usage
Open your browser and navigate to [ShortZoid](https://shortzoid.vercel.app/).

- Sign up or log in to your account.
- Once logged in, enter the URL you want to shorten in the provided field.
- Click "Generate" to generate a shortened link and QR Code.
- Access additional features such as generating QR codes, tracking clicks, and viewing your URL history from your dashboard.
- Copy your shortened URL or Download the QR Code and share it with others!

### Run Locally
Clone the project

```bash
  git clone https://github.com/pulkitgarg04/shortzoid
```

Go to the project directory

```bash
  cd shortzoid
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

### Environment Variables
To run this project, you will need to add the following environment variables to your .env file:
`PORT`
`SECRET`
`MONGODB_URL`
`EMAIL`
`EMAIL_PASSWORD`
`IPSTACK_API_KEY`

### Contributing
We appreciate your interest in contributing to ShortZoid! Your contributions help us improve and grow. Please feel free to submit pull requests, report issues, or suggest new features. Your feedback and participation are highly valued as we continue to develop and enhance the platform.

### License
This project is licensed under the MIT License - see the LICENSE.md file for details.