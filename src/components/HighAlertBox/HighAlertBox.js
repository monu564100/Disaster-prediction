import React from 'react';
import { Box, Typography, Link, Card, CardContent } from '@mui/material';
import './HighAlertBox.css'; // Ensure this line is added
function HighAlertBox({ newsData }) {
  return (
    <Box className="high-alert-box">
      <Typography variant="h5" component="h5" className="high-alert-title" marginBottom="1rem">
        High-Alert Areas in India (Top News)
      </Typography>
      {newsData.length > 0 ? (
        newsData.map((newsItem, index) => (
          <Card key={index} variant="outlined" className="news-card">
            <CardContent>
              <Typography variant="h6" className="news-card-title">{newsItem.title}</Typography>
              <Typography variant="body2" className="news-card-description" color="text.secondary">
                {newsItem.description}
              </Typography>
              <Link href={newsItem.url} target="_blank" className="news-card-link">
                Read More
              </Link>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography className="no-news">No high-alert news available.</Typography>
      )}
    </Box>
  );
}

export default HighAlertBox;
