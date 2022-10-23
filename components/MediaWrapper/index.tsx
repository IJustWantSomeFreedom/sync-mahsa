import { Group } from '@mantine/core';
import React from 'react'
import {
    EmailShareButton,
    EmailIcon,

    FacebookShareButton,
    FacebookIcon,

    HatenaShareButton,
    HatenaIcon,

    InstapaperShareButton,
    InstapaperIcon,

    LineShareButton,
    LineIcon,

    LinkedinShareButton,
    LinkedinIcon,

    LivejournalShareButton,
    LivejournalIcon,

    MailruShareButton,
    MailruIcon,

    OKShareButton,
    OKIcon,

    PocketShareButton,
    PocketIcon,

    RedditShareButton,
    RedditIcon,

    TelegramShareButton,
    TelegramIcon,

    TumblrShareButton,
    TumblrIcon,

    TwitterShareButton,
    TwitterIcon,

    ViberShareButton,
    ViberIcon,

    VKShareButton,
    VKIcon,

    WhatsappShareButton,
    WhatsappIcon,

    WorkplaceShareButton,
    WorkplaceIcon,
} from "react-share";
import { APP_URL } from '../../lib/env';

const SHARE_URL = process.env.NODE_ENV === "production" ? APP_URL : "https://google.com"

const MediaWrapper: React.FC = () => {
    return (
        <Group>
            <EmailShareButton url={SHARE_URL}>
                <EmailIcon size={40} round />
            </EmailShareButton>

            <FacebookShareButton url={SHARE_URL}  >
                <FacebookIcon size={40} round />
            </FacebookShareButton>

            <HatenaShareButton url={SHARE_URL}  >
                <HatenaIcon size={40} round />
            </HatenaShareButton>

            <InstapaperShareButton url={SHARE_URL}  >
                <InstapaperIcon size={40} round />
            </InstapaperShareButton>

            <LineShareButton url={SHARE_URL}  >
                <LineIcon size={40} round />
            </LineShareButton>

            <LinkedinShareButton url={SHARE_URL}  >
                <LinkedinIcon size={40} round />
            </LinkedinShareButton>

            <LivejournalShareButton url={SHARE_URL}  >
                <LivejournalIcon size={40} round />
            </LivejournalShareButton>

            <MailruShareButton url={SHARE_URL}  >
                <MailruIcon size={40} round />
            </MailruShareButton>

            <OKShareButton url={SHARE_URL}  >
                <OKIcon size={40} round />
            </OKShareButton>

            <PocketShareButton url={SHARE_URL}  >
                <PocketIcon size={40} round />
            </PocketShareButton>

            <RedditShareButton url={SHARE_URL}  >
                <RedditIcon size={40} round />
            </RedditShareButton>

            <TelegramShareButton url={SHARE_URL}  >
                <TelegramIcon size={40} round />
            </TelegramShareButton>

            <TumblrShareButton url={SHARE_URL}  >
                <TumblrIcon size={40} round />
            </TumblrShareButton>

            <TwitterShareButton url={SHARE_URL}  >
                <TwitterIcon size={40} round />
            </TwitterShareButton>

            <ViberShareButton url={SHARE_URL}  >
                <ViberIcon size={40} round />
            </ViberShareButton>

            <VKShareButton url={SHARE_URL}  >
                <VKIcon size={40} round />
            </VKShareButton>

            <WhatsappShareButton url={SHARE_URL}  >
                <WhatsappIcon size={40} round />
            </WhatsappShareButton>

            <WorkplaceShareButton url={SHARE_URL}  >
                <WorkplaceIcon size={40} round />
            </WorkplaceShareButton>
        </Group>
    )
}

export default MediaWrapper