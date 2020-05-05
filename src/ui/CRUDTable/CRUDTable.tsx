import React from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Spinner from 'react-bootstrap/Spinner';

import { BsPencil, BsTrash } from 'react-icons/bs';

import { Icollection } from 'lib/state/createCollection';

import CSS from './CRUDTable.module.scss';

interface CRUDTableProps {
  collection: Icollection;
  baseUrl: string;
  newLinkLabel: string;
  title: string;
}

export const CRUDTable: React.FC<CRUDTableProps> = observer(
  ({ collection, baseUrl, newLinkLabel, title }) => (
    <>
      <h2>{title}</h2>
      {!collection.isLoaded ? (
        <Spinner animation="grow" variant="info" />
      ) : (
        <>
          <div className={cx(CSS.header, 'pull-apart')}>
            <h3 className="h6">Name</h3>

            <h3 className="h6">Actions</h3>
          </div>
          <ul className="list-unstyled">
            {collection.asArray.map(({ id, name }) => (
              <li className={cx(CSS.tableRow, 'pull-apart')} key={id}>
                <Link to={`${baseUrl}/${id}`}>{name}</Link>

                <ButtonGroup>
                  <Link to={`${baseUrl}/${id}/edit`}>
                    <Button as="span">
                      Edit
                      <BsPencil className={CSS.iconInButton} />
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    onClick={() => {
                      if (window.confirm(`Are you sure, you want to delete ${name}`)) {
                        collection.deleteModel(id);
                      }
                    }}
                  >
                    Delete <BsTrash className={CSS.iconInButton} />
                  </Button>
                </ButtonGroup>
              </li>
            ))}
          </ul>
          <div className="pull-right">
            <Link to={`${baseUrl}/new`}>
              <Button as="span">{newLinkLabel}</Button>
            </Link>
          </div>
        </>
      )}
    </>
  )
);
