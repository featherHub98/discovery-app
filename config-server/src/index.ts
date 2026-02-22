import express, { Request, Response } from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = 8888;


const GITHUB_OWNER = 'featherHub98';
const GITHUB_REPO = 'configs';
const GITHUB_BRANCH = 'main';
const CONFIG_PATH_PREFIX = ''; 


app.use(cors());
app.use(express.json());


app.get('/:serviceName/:profile', async (req: Request, res: Response) => {
  const { serviceName, profile } = req.params;

  
  const githubUrl = `${CONFIG_PATH_PREFIX}${serviceName}/${profile}.json`
   

  const fullUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${githubUrl}`;

  try {
    console.log(`Fetching config from: ${fullUrl}`);
    const response = await axios.get(fullUrl);
    console.log('config fetched',response.data)
    res.json(response.data);
  } catch (error: any) {
    console.error('GitHub fetch error:', error.message);
    if (error.response?.status === 404) {
      return res.status(404).json({
        error: `Configuration not found for ${serviceName}/${profile}`,
        url: fullUrl, 
      });
    }
    res.status(500).json({ error: 'Failed to retrieve configuration from GitHub' });
  }
});

app.listen(PORT, () => {
  console.log(`Config Server running on port ${PORT}`);
  console.log(`Serving configurations from GitHub: ${GITHUB_OWNER}/${GITHUB_REPO} (${GITHUB_BRANCH})`);
});