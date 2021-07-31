import React from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';

import { BsPencil, BsTrash } from 'react-icons/bs';

import { Button, buttonStyles } from 'ui/Button';
// import { Icollection } from 'lib/state/createCollection';

import styled from 'styled-components';

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

interface CRUDTableProps {
  collection: { id: string; name: string; delete: () => void }[];
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
            {collection.map(({ id, name }) => (
              <TableRow key={id}>
                <Link to={`${baseUrl}/${id}`}>{name}</Link>

                <StyledLink to={`${baseUrl}/${id}/edit`}>
                  Edit
                  <IconInButton>
                    <BsPencil />
                  </IconInButton>
                </StyledLink>
                <Button
                  onClick={() => {
                    if (window.confirm(`Are you sure, you want to delete ${name}`)) {
                      // collection.deleteModel(id);
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
          <div className="pull-right">
            <StyledLink to={`${baseUrl}/new`}>{newLinkLabel}</StyledLink>
          </div>
        </>
      </>
    );
  }
);
