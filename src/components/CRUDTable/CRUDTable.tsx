import React from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';

import { BsPencil, BsTrash } from 'react-icons/bs';

import { Button, buttonStyles } from 'ui/Button';
// import { Icollection } from 'lib/state/createCollection';

import styled from 'styled-components/macro';
import { Icollection } from 'lib/state';
import { capitalizeFirstLetter } from 'lib/strings';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.rhythms.inside.vertical}px;
  border-bottom: 1px solid lightslategray;
`;

const List = styled.ul`
  list-style: none;
`;

const TableRow = styled.li`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.rhythms.inside.vertical}px;
  padding: ${({ theme }) => theme.rhythms.inside.vertical}px 0;
  border-bottom: 1px solid lightgray;
`;

const IconInButton = styled.span`
  margin-left: 4px;
`;

const StyledLink = styled(Link)`
  ${buttonStyles}
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.rhythms.inside.vertical}px;
`;

interface CRUDTableProps {
  collection: Icollection;
  baseUrl: string;
  newLinkLabel: string;
  title: string;
}

export const CRUDTable: React.FC<CRUDTableProps> = observer(
  ({ collection, baseUrl, newLinkLabel, title }) => {
    return (
      <>
        <h2>{title}</h2>

        <>
          <Header>
            <h3 className="h6">Name</h3>
            <h3 className="h6">Actions</h3>
          </Header>
          <List>
            {collection.asArray.map(({ _id, name }) => (
              <TableRow key={_id}>
                <Link to={`/${baseUrl}/${_id}`}>{capitalizeFirstLetter(name)}</Link>

                <StyledLink to={`/${baseUrl}/${_id}/edit`}>
                  Edit
                  <IconInButton>
                    <BsPencil />
                  </IconInButton>
                </StyledLink>
                <Button
                  onClick={() => {
                    if (window.confirm(`Are you sure, you want to delete ${name}`)) {
                      collection.deleteModel(_id);
                    }
                  }}
                >
                  Delete{' '}
                  <IconInButton>
                    <BsTrash />
                  </IconInButton>
                </Button>
              </TableRow>
            ))}
          </List>
          <Footer>
            <StyledLink to={`/${baseUrl}/new`}>{newLinkLabel}</StyledLink>
          </Footer>
        </>
      </>
    );
  }
);
