import React, { useState } from 'react';
import classes from './Homepage.module.css';
import Header from './component/Header';
import { Link } from 'react-router-dom';

const Homepage = () => {
    return (
        <div className={classes.container}>
            <Header title="HomePage"></Header>
            <p className={classes.home}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit
                amet sem nec nibh aliquam interdum. Suspendisse volutpat aliquet
                augue non iaculis. Aliquam erat volutpat. Sed sit amet
                ullamcorper lacus, non lacinia nulla. Etiam luctus pulvinar
                consectetur. Cras ut orci ut libero mollis blandit. Praesent sit
                amet venenatis libero. Mauris porttitor dolor ut dui fermentum
                ultrices. Quisque id tellus lorem. Nulla tristique nec lorem sed
                facilisis. Fusce quis gravida augue. Pellentesque purus arcu,
                pretium id placerat non, rhoncus quis lectus. Duis tincidunt eu
                metus id cursus. Sed malesuada, elit accumsan euismod ultricies,
                neque lacus eleifend arcu, luctus accumsan purus ante et turpis.
                Sed leo neque, vulputate ac magna eget, posuere fringilla neque.
                Nunc non dolor pellentesque, ornare eros ut, ornare enim.
                Maecenas congue fringilla leo quis tristique. Etiam vitae
                pulvinar enim, at auctor ex. Nulla suscipit malesuada velit, nec
                sollicitudin diam pharetra id. Nulla eget lorem sed ex elementum
                dictum ut facilisis urna. Phasellus non imperdiet nulla, eget
                gravida odio. Donec laoreet, lectus quis pulvinar condimentum,
                urna lorem egestas velit, nec lobortis dolor neque id lacus.
                Morbi quis velit sed ante cursus elementum in aliquam lacus. Ut
                a lacus aliquam, consectetur justo sit amet, aliquet quam.
                Suspendisse mattis rhoncus dolor vitae elementum. Nam commodo
                elementum vulputate. Suspendisse in risus interdum, pellentesque
                justo eu, aliquet erat. Morbi faucibus velit quis aliquam
                facilisis. Nulla fringilla erat nunc, sed congue sem imperdiet
                id. Quisque id congue neque. Orci varius natoque penatibus et
                magnis dis parturient montes, nascetur ridiculus mus.
                Suspendisse a mauris ac ante auctor aliquam. Nam tincidunt velit
                vitae magna hendrerit congue. Mauris vel euismod massa, quis
                congue sem. In magna mauris, tempor sit amet orci non, imperdiet
                vulputate nisl. Duis nec vulputate arcu, ac sollicitudin ipsum.
                Nullam sit amet semper nisi. Nam sit amet lorem et sem feugiat
                volutpat at id enim. Sed odio urna, sagittis sed nulla id,
                sollicitudin tempus turpis. Orci varius natoque penatibus et
                magnis dis parturient montes, nascetur ridiculus mus. Phasellus
                finibus leo et libero faucibus pulvinar. Phasellus dapibus
                tortor vitae magna faucibus, non auctor augue tincidunt. Morbi
                auctor ligula ac neque iaculis maximus. Etiam a congue ex.
                Mauris convallis vitae lacus id consectetur. Suspendisse vel
                volutpat libero, ac efficitur est. Nunc varius felis nec viverra
                scelerisque. Integer nec sem quam. Curabitur at fringilla orci.
                Nunc vitae erat ipsum. Morbi ut est venenatis, bibendum sapien
                ac, bibendum purus. Sed malesuada sodales porttitor.
            </p>

            <div className={classes.linkDiv}>
                <Link to="/characters/page/0" className={classes.link}>
                    Characters
                </Link>
                <Link to="/comics/page/0" className={classes.link}>
                    Comics
                </Link>
                <Link to="/series/page/0" className={classes.link}>
                    Series
                </Link>
            </div>
        </div>
    );
};

export default Homepage;
