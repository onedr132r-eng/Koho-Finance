--
-- PostgreSQL database dump
--

\restrict o88tsiwSekJ2si8dxyJtra0D1AvIO8ZGuAWvYBw6kw4JipO0pYJw59xSEZ08kaA

-- Dumped from database version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.accounts (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    spendable_balance numeric(12,2) DEFAULT '0'::numeric NOT NULL,
    cover_available numeric(12,2) DEFAULT '0'::numeric NOT NULL,
    cover_limit numeric(12,2) DEFAULT '150'::numeric NOT NULL,
    account_number text DEFAULT '218130721705'::text NOT NULL,
    transit_number text DEFAULT '16001'::text NOT NULL,
    institution_number text DEFAULT '621'::text NOT NULL,
    institution_name text DEFAULT 'Peoples Trust Company'::text NOT NULL,
    notification_count integer DEFAULT 10 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.accounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.accounts_id_seq OWNED BY public.accounts.id;


--
-- Name: cashback; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cashback (
    id integer NOT NULL,
    total_earned numeric(12,2) DEFAULT 11.49 NOT NULL,
    earned_this_month numeric(12,2) DEFAULT 2.35 NOT NULL,
    earned_last_month numeric(12,2) DEFAULT 5.13 NOT NULL,
    rate numeric(5,2) DEFAULT 0.5 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: cashback_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cashback_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cashback_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cashback_id_seq OWNED BY public.cashback.id;


--
-- Name: credit_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.credit_profiles (
    id integer NOT NULL,
    score numeric(5,0) DEFAULT '571'::numeric NOT NULL,
    score_change numeric(5,0) DEFAULT '0'::numeric NOT NULL,
    status text DEFAULT 'Building'::text NOT NULL,
    next_range numeric(5,0) DEFAULT '89'::numeric NOT NULL,
    credit_building_active boolean DEFAULT true NOT NULL,
    credit_building_action_required boolean DEFAULT true NOT NULL,
    secured_credit_active boolean DEFAULT false NOT NULL,
    rent_reporting_active boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: credit_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.credit_profiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: credit_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.credit_profiles_id_seq OWNED BY public.credit_profiles.id;


--
-- Name: crypto_holdings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.crypto_holdings (
    id integer NOT NULL,
    symbol text NOT NULL,
    name text NOT NULL,
    amount numeric(18,8) DEFAULT '0'::numeric NOT NULL,
    value numeric(12,2) DEFAULT '0'::numeric NOT NULL,
    change_24h numeric(8,4) DEFAULT '0'::numeric NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: crypto_holdings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.crypto_holdings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: crypto_holdings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.crypto_holdings_id_seq OWNED BY public.crypto_holdings.id;


--
-- Name: goals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.goals (
    id integer NOT NULL,
    name text NOT NULL,
    target_amount numeric(12,2) NOT NULL,
    current_amount numeric(12,2) DEFAULT '0'::numeric NOT NULL,
    emoji text DEFAULT '🎯'::text NOT NULL,
    deadline text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: goals_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.goals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: goals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.goals_id_seq OWNED BY public.goals.id;


--
-- Name: savings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.savings (
    id integer NOT NULL,
    vault numeric(12,2) DEFAULT '0'::numeric NOT NULL,
    roundups numeric(12,2) DEFAULT '0'::numeric NOT NULL,
    interest_rate numeric(5,2) DEFAULT '2'::numeric NOT NULL,
    total_interest_earned numeric(12,2) DEFAULT 15.10 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: savings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.savings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: savings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.savings_id_seq OWNED BY public.savings.id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.transactions (
    id integer NOT NULL,
    merchant text NOT NULL,
    amount numeric(12,2) NOT NULL,
    category text NOT NULL,
    date text NOT NULL,
    "time" text NOT NULL,
    status text DEFAULT 'completed'::text NOT NULL,
    merchant_icon text,
    merchant_color text,
    is_credit boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;


--
-- Name: accounts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts ALTER COLUMN id SET DEFAULT nextval('public.accounts_id_seq'::regclass);


--
-- Name: cashback id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cashback ALTER COLUMN id SET DEFAULT nextval('public.cashback_id_seq'::regclass);


--
-- Name: credit_profiles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credit_profiles ALTER COLUMN id SET DEFAULT nextval('public.credit_profiles_id_seq'::regclass);


--
-- Name: crypto_holdings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.crypto_holdings ALTER COLUMN id SET DEFAULT nextval('public.crypto_holdings_id_seq'::regclass);


--
-- Name: goals id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.goals ALTER COLUMN id SET DEFAULT nextval('public.goals_id_seq'::regclass);


--
-- Name: savings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.savings ALTER COLUMN id SET DEFAULT nextval('public.savings_id_seq'::regclass);


--
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.accounts VALUES (1, 'Alex Johnson', 'alex@koho.ca', 1243.87, 150.00, 150.00, '218130721705', '16001', '621', 'Peoples Trust Company', 3, '2026-06-06 05:44:53.798536');


--
-- Data for Name: cashback; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.cashback VALUES (1, 11.49, 2.35, 5.13, 0.50, '2026-06-06 05:44:53.806794');


--
-- Data for Name: credit_profiles; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.credit_profiles VALUES (1, 571, 12, 'Building', 89, true, true, false, false, '2026-06-06 05:44:53.809946');


--
-- Data for Name: crypto_holdings; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.crypto_holdings VALUES (1, 'BTC', 'Bitcoin', 0.00412000, 245.80, 2.3400, '2026-06-06 05:44:53.808689');
INSERT INTO public.crypto_holdings VALUES (2, 'ETH', 'Ethereum', 0.15200000, 312.40, -1.1200, '2026-06-06 05:44:53.808689');


--
-- Data for Name: goals; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.goals VALUES (1, 'Vacation Fund', 2000.00, 850.00, '✈️', 'DEC 2026', '2026-06-06 05:44:53.805323');
INSERT INTO public.goals VALUES (2, 'Emergency Fund', 5000.00, 3842.50, '🛡️', NULL, '2026-06-06 05:44:53.805323');
INSERT INTO public.goals VALUES (3, 'New Laptop', 1500.00, 320.00, '💻', 'SEP 2026', '2026-06-06 05:44:53.805323');


--
-- Data for Name: savings; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.savings VALUES (1, 3842.50, 47.23, 2.00, 15.10, '2026-06-06 05:44:53.803944');


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.transactions VALUES (1, 'Tim Hortons', 4.75, 'Food & Drink', 'JUN 6TH, 2026', '8:32 AM', 'completed', '☕', '#c8102e', false, '2026-06-06 05:44:53.812318');
INSERT INTO public.transactions VALUES (2, 'Netflix', 17.99, 'Entertainment', 'JUN 5TH, 2026', '12:00 AM', 'completed', '🎬', '#e50914', false, '2026-06-06 05:44:53.812318');
INSERT INTO public.transactions VALUES (3, 'Loblaws', 63.42, 'Groceries', 'JUN 4TH, 2026', '5:14 PM', 'completed', '🛒', '#f5a623', false, '2026-06-06 05:44:53.812318');
INSERT INTO public.transactions VALUES (4, 'Payroll Deposit', 1850.00, 'Income', 'JUN 1ST, 2026', '6:00 AM', 'completed', '💰', '#2ecc71', true, '2026-06-06 05:44:53.812318');
INSERT INTO public.transactions VALUES (5, 'Uber', 12.30, 'Transport', 'MAY 31ST, 2026', '11:45 PM', 'completed', '🚗', '#000000', false, '2026-06-06 05:44:53.812318');
INSERT INTO public.transactions VALUES (6, 'Amazon', 34.99, 'Shopping', 'MAY 30TH, 2026', '3:22 PM', 'completed', '📦', '#ff9900', false, '2026-06-06 05:44:53.812318');
INSERT INTO public.transactions VALUES (7, 'Spotify', 11.99, 'Entertainment', 'MAY 28TH, 2026', '12:00 AM', 'completed', '🎵', '#1db954', false, '2026-06-06 05:44:53.812318');
INSERT INTO public.transactions VALUES (8, 'Shoppers Drug Mart', 8.47, 'Health', 'MAY 27TH, 2026', '2:05 PM', 'completed', '💊', '#e30613', false, '2026-06-06 05:44:53.812318');


--
-- Name: accounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.accounts_id_seq', 1, true);


--
-- Name: cashback_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cashback_id_seq', 1, true);


--
-- Name: credit_profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.credit_profiles_id_seq', 1, true);


--
-- Name: crypto_holdings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.crypto_holdings_id_seq', 2, true);


--
-- Name: goals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.goals_id_seq', 3, true);


--
-- Name: savings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.savings_id_seq', 1, true);


--
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.transactions_id_seq', 8, true);


--
-- Name: accounts accounts_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_email_unique UNIQUE (email);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: cashback cashback_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cashback
    ADD CONSTRAINT cashback_pkey PRIMARY KEY (id);


--
-- Name: credit_profiles credit_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.credit_profiles
    ADD CONSTRAINT credit_profiles_pkey PRIMARY KEY (id);


--
-- Name: crypto_holdings crypto_holdings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.crypto_holdings
    ADD CONSTRAINT crypto_holdings_pkey PRIMARY KEY (id);


--
-- Name: goals goals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.goals
    ADD CONSTRAINT goals_pkey PRIMARY KEY (id);


--
-- Name: savings savings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.savings
    ADD CONSTRAINT savings_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict o88tsiwSekJ2si8dxyJtra0D1AvIO8ZGuAWvYBw6kw4JipO0pYJw59xSEZ08kaA

