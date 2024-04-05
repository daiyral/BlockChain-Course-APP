import React from 'react';
import {
    makeStyles,
    shorthands,
    Button,
    Caption1,
    Text,
    tokens,
    Subtitle1,
  } from "@fluentui/react-components";
import { Card, CardHeader, CardPreview } from "@fluentui/react-components";
import { MoreHorizontal20Regular } from "@fluentui/react-icons";
import candidateImage from '../images/stock_candidate.jpg';

const useStyles = makeStyles({
    main: {
      ...shorthands.gap("36px"),
      display: "flex",
      flexDirection: "column",
      flexWrap: "wrap",
    },
  
    card: {
      width: "360px",
      maxWidth: "100%",
      height: "fit-content",
    },
  
    section: {
      width: "fit-content",
    },
  
    title: {
      ...shorthands.margin(0, 0, "12px"),
    },
  
    horizontalCardImage: {
      width: "64px",
      height: "64px",
    },
  
    headerImage: {
      ...shorthands.borderRadius("4px"),
      maxWidth: "44px",
      maxHeight: "44px",
    },
  
    caption: {
      color: tokens.colorNeutralForeground3,
    },
  
    text: {
      ...shorthands.margin(0),
    },
  });

function CandidateCard({ candidate }) {
const styles = useStyles();
  return (
    <Card className={styles.card} orientation="horizontal">
          <CardPreview className={styles.horizontalCardImage}>
            <img
              className={styles.horizontalCardImage}
              src={candidateImage}
              alt="App Name Document"
            />
          </CardPreview>
          <CardHeader
            header={<Text weight="semibold">{candidate.header}</Text>}
            description={
              <Caption1 className={styles.caption}>{candidate.slogan}</Caption1>
            }
            // action={
            //   <Button
            //     appearance="transparent"
            //     icon={<MoreHorizontal20Regular />}
            //     aria-label="More options"
            //   />
            // }
          />
        </Card>
  );
}

export default CandidateCard;