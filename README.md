# Saginaw Digital Trophy Case

A web application that showcases trophies, awards, and achievements from Saginaw schools.

## Deployment with AWS Amplify

This project is configured to be deployed with AWS Amplify. Follow these steps to deploy it:

### Prerequisites

1. AWS Account
2. [AWS CLI](https://aws.amazon.com/cli/) installed and configured
3. [AWS Amplify CLI](https://docs.amplify.aws/cli/start/install/) installed

```bash
npm install -g @aws-amplify/cli
```

### Deployment Steps

1. **Initialize Amplify** (if not already done):

```bash
amplify init
```

Follow the prompts to connect to your AWS account.

2. **Push the configuration to AWS**:

```bash
amplify push
```

This will create all the necessary resources in your AWS account.

3. **Deploy the frontend**:

Connect your GitHub repository to AWS Amplify Console:
- Go to the [AWS Amplify Console](https://console.aws.amazon.com/amplify/home)
- Click "Connect app"
- Choose your Git provider
- Select your repository and branch
- Review the build settings (they should be automatically detected)
- Click "Save and deploy"

### Configuration

- The API is configured to handle requests to `/api/schools`, `/api/teams`, `/api/individuals`, and `/api/axios`
- All API requests are processed by a single Lambda function
- Static assets are served from the root directory

### Local Development

To run the project locally:

```bash
npm install
npm run dev
```

## Project Structure

- `/index.html` - Main HTML file
- `/app.js` - Application logic
- `/styles.css` - CSS styles
- `/api/` - API endpoints (converted to AWS Lambda function)
- `/amplify/` - AWS Amplify configuration

## API Integration

This application integrates with Budibase for data retrieval. The AWS Lambda function handles API requests and forwards them to Budibase. 