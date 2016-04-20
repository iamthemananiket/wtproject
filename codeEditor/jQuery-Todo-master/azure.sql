--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: micro; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE micro (
    a character varying(2)
);


ALTER TABLE micro OWNER TO postgres;

--
-- Name: microsoft; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE microsoft (
    a character varying(2)
);


ALTER TABLE microsoft OWNER TO postgres;

--
-- Data for Name: micro; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY micro (a) FROM stdin;
as
ss
fs
\.


--
-- Data for Name: microsoft; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY microsoft (a) FROM stdin;
fs
fs
\.


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

