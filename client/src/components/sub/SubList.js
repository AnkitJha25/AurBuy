import React, { useEffect, useState } from 'react';
import {getSubs} from '../../functions/sub';
import {Link} from 'react-router-dom';

const SubList = () => {
    const [subs, setSubs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect (() => {
        setLoading(true);
        getSubs().then(c => {
            setSubs(c.data);
            setLoading(false);
        });
    }, []);

    const showSubs = () => 
        subs.map(s => (
            <div key={s._id} className='col btn btn-outlined-primary btn-lg btn-block btn-raised m-3'>
                <Link to={`/sub/${s.slug}`}>{s.name}</Link>
            </div>
        ));

    return (
        <div className='container'>
            <div className='row'>
                {loading ? (
                    <h4 className='text-center'>Loading...</h4>
                ) : (
                    showSubs()
                )}
            </div>
        </div>
    );
}

export default SubList;