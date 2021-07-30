import React from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';

import { BsPencil, BsTrash } from 'react-icons/bs';

import { Button } from 'ui/Button';
// import { Icollection } from 'lib/state/createCollection';

import { Istore } from 'store';
import styled from 'styled-components';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.rhythms.inside.vertical};
  border-bottom: 1px solid lightslategray;
`;

const List = styled.ul`
  list-style: none;
`;

const TableRow = styled.li`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.rhythms.inside.vertical};
  padding: ${({ theme }) => theme.rhythms.inside.vertical} 0;
  border-bottom: 1px solid lightgray;
`;

const IconInButton = styled.span`
  margin-left: 4px;
`;

interface CRUDTableProps {
  collection: Istore['characters'];
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

                <Link to={`${baseUrl}/${id}/edit`}>
                  <Button as="span">
                    Edit
                    <IconInButton>
                      <BsPencil />
                    </IconInButton>
                  </Button>
                </Link>
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
            <Link to={`${baseUrl}/new`}>
              <Button as="span">{newLinkLabel}</Button>
            </Link>
          </div>
        </>
      </>
    );
  }
);
