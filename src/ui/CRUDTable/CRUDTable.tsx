import React from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import cx from 'classnames';

// import { BsPencil, BsTrash } from 'react-icons/bs';

// import { Button } from 'ui/Button';
// import { Icollection } from 'lib/state/createCollection';

import CSS from './CRUDTable.module.scss';
import { Istore } from 'store';

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
          <div className={cx(CSS.header, 'pull-apart')}>
            <h3 className="h6">Name</h3>

            <h3 className="h6">Actions</h3>
          </div>
          <ul className="list-unstyled">
            {collection.map(({ id, name }) => (
              <li className={cx(CSS.tableRow, 'pull-apart')} key={id}>
                <Link to={`${baseUrl}/${id}`}>{name}</Link>

                {/* <Link to={`${baseUrl}/${id}/edit`}>
                  <Button<'span'> as="span">
                    Edit
                    <BsPencil className={CSS.iconInButton} />
                  </Button>
                </Link> */}
                {/* <Button
                    onClick={() => {
                      if (window.confirm(`Are you sure, you want to delete ${name}`)) {
                        collection.deleteModel(id);
                      }
                    }}
                  >
                    Delete <BsTrash className={CSS.iconInButton} />
                  </Button> */}
              </li>
            ))}
          </ul>
          {/* <div className="pull-right">
            <Link to={`${baseUrl}/new`}>
              <Button as="span">{newLinkLabel}</Button>
            </Link>
          </div> */}
        </>
      </>
    );
  }
);
