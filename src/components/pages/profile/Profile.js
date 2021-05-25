import React, { useContext, useEffect, useRef } from 'react';
import { useQuery as useRQuery } from 'react-query';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import defaultProfilePicture from '../../../assets/default-profile-picture.png';
import Balance from '../../NavigationComponents/Balance';
import Button from '../../common/Button';
import { ArtItemEditable } from '../../common/art';
import { Tabs } from '../../common/tabs';

import { useQuery } from '../../../hooks';

import { NearContext, NftContractContext } from '../../../contexts';

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 767px;
  padding: 100px 28px 120px;

  > * {
    margin: 0 0 25px;
  }

  .summary {
    display: flex;
    flex-direction: row;
    align-items: center;

    > * {
      margin-right: 40px;
    }

    .picture {
      width: 62px;
      height: 62px;
      border-radius: 100%;
    }

    .summary-block {
      display: flex;
      flex-direction: column;
      min-width: 40px;
      white-space: nowrap;

      .summary-block-top {
        font-size: 20px;
        line-height: 25px;
        color: var(--periwinkle);

        .usds {
          font-size: 12px;
        }
      }

      .summary-block-bottom {
        font-size: 11px;
        line-height: 18px;
        color: var(--lavendar);
      }
    }
  }

  .tabs-tab.tabs-tab--active {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  @media (min-width: 767px) {
    margin: 0 auto;
    align-items: center;

    > * {
      margin: 0 0 50px;
    }

    > .button {
      width: 350px;
    }

    .tabs-tab.tabs-tab--active {
      justify-content: space-evenly;
    }
  }
`;

export default function Profile() {
  const ownedGemRef = useRef();
  const query = useQuery();
  const { user } = useContext(NearContext);
  const { getGemsForOwner } = useContext(NftContractContext);

  useEffect(() => {
    if (ownedGemRef?.current) {
      setTimeout(() => {
        requestAnimationFrame(() => ownedGemRef.current.scrollIntoView({ behavior: 'smooth' }));
      }, 10);
    }
  }, []);

  const { data: gemsForOwner } = useRQuery(
    ['gemsForOwner', user.accountId],
    // todo: pagination
    () => getGemsForOwner(user.accountId, '0', '50'),
    { placeholderData: [] }
  );

  const ownedGemId = query.get('gem-id');

  return (
    <Container>
      <div className="summary">
        <img className="picture" src={defaultProfilePicture} alt="profile picture" width="62" height="62" />
        <div className="summary-block">
          <span className="summary-block-top">0</span>
          <span className="summary-block-bottom">Pieces Sold</span>
        </div>
        <div className="summary-block">
          <Balance className="summary-block-top" precision={2} />
          <span className="summary-block-bottom">Your Funds</span>
        </div>
      </div>
      <p className="profile-description">You haven’t added a description yet.</p>
      <Button isSecondary>
        <Link to="/profile/edit">Edit Profile</Link>
      </Button>
      <Tabs
        tabsArray={[
          {
            title: 'Gems I own',
            content: gemsForOwner.map(({ token_id, metadata: { media } = {} }) => (
              <ArtItemEditable
                dataUrl={media}
                forwardedRef={ownedGemId === token_id ? ownedGemRef : null}
                key={token_id}
                gemId={token_id}
              />
            )),
          },
          {
            title: 'Gems I made',
            // todo: after integration with NFT contract set ArtItem id to gemId
            content: Array.from({ length: 2 }).map((_, i) => <ArtItemEditable key={`art-item-made-${i}`} />),
          },
        ]}
      />
    </Container>
  );
}
