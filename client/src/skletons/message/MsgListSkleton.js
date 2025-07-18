import React from 'react';
import UserPP from '../../components/UserPP';

const MsgListSkleton = ({ count = 1 }) => {
    return Array(count).fill(0).map((_, index) => (
        <li key={index}  className='message-list-item'>
            <div className="skeleton-card mb-0 p-1 border-0">
                <div className="skeleton-header mb-0">
                    <div className="skeleton-avatar" />
                    <div className="skeleton-lines">
                        <div className="skeleton-line short" />
                        <div className="skeleton-line medium" />
                    </div>
                </div>

            </div>
        </li>

    ));
};

export default MsgListSkleton;
// export default CpSkleton;
