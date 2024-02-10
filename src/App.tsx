import React, { useEffect, useState } from "react";
import { Divider, Table, Checkbox } from "antd";
import type { CheckboxOptionType } from "antd";
import { ColumnsType, DataType } from "./types";

const App: React.FC = () => {

  const columns: ColumnsType<DataType> = [
    {
      title: 'Stroka',
      dataIndex: 'stroka',
      sorter: (a, b) => a.stroka.localeCompare(b.stroka)
    },
    {
      title: 'Data',
      dataIndex: 'data',
      sorter: (a, b) => a.data.localeCompare(b.data)
    },
    {
      title: 'Number',
      dataIndex: 'number',
      sorter: (a, b) => a.number - b.number
    },
    {
      title: "Flag",
      dataIndex: "flag",
      render: (flag, record) => {
        return (
          <Checkbox
            checked={flag}
            disabled={true}
          />
        )
      },
      sorter: (a, b) => (a.flag === b.flag) ? 0 : a.flag ? -1 : 1,
    },
    {
      title: 'Stroka2',
      dataIndex: 'stroka2',
      sorter: (a, b) => a.stroka2.localeCompare(b.stroka2)
    },
    {
      title: 'Data2',
      dataIndex: 'data2',
      sorter: (a, b) => a.data2.localeCompare(b.data2)
    },
    {
      title: 'Number2',
      dataIndex: 'number2',
      sorter: (a, b) => a.number2 - b.number2
    },
    {
      title: "Flag2",
      dataIndex: "flag2",
      render: (flag2, record) => {
        return (
          <Checkbox
            checked={flag2}
            disabled={true}
          />
        )
      },
      sorter: (a, b) => (a.flag2 === b.flag2) ? 0 : a.flag2 ? -1 : 1,
    },
  ];

  const testData: DataType[] = [];
  for (let i = 0; i < 2000; i++) {
    testData.push({
      key: i,
      stroka: `Stroka ${i}`,
      data: `Data ${i}`,
      number: i,
      flag: i % 2 === 0,
      stroka2: `Stroka2 ${i}`,
      data2: `Data2 ${i}`,
      number2: i,
      flag2: i % 3 === 0,
    });
  }

  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({});
  const [sorter, setSorter] = useState({});


  useEffect(() => {
    const savedFilters = localStorage.getItem('tableFilters');
    if (savedFilters) {
      setFilters(JSON.parse(savedFilters));
    }

    const savedSorter = localStorage.getItem('tableSorter');
    if (savedSorter) {
      setSorter(JSON.parse(savedSorter));
    }
  }, []);


  useEffect(() => {
    localStorage.setItem('tableFilters', JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    localStorage.setItem('tableSorter', JSON.stringify(sorter));
  }, [sorter]);

  const generateFilters = (column: any) => {
    if (data.length) {
      const uniqueValues = [...new Set(data.map((item) => item[column.dataIndex as keyof typeof item]))];
      return uniqueValues.map((value) => ({
        text: value,
        value: value,
      }));
    }
    return [];
  };

  const dynamicColumns = columns.map((column) => {
    const savedSorter = JSON.parse(localStorage.getItem('tableSorter') as string);
    const savedFilter = JSON.parse(localStorage.getItem('tableFilters') as string);
    const excludeColumns = ['flag', 'flag2', 'number', 'number2'];
    if (!excludeColumns.includes((column as any).dataIndex)) {
      return {
        ...column,
        filters: generateFilters(column),
        onFilter: (value: string, record: any) => {
          return record[(column as any).dataIndex as keyof typeof column]?.indexOf(value) === 0
        },
        ...((savedSorter as any).field === (column as any).dataIndex ? { defaultSortOrder: (savedSorter as any).order } : {}),
        ...(savedFilter[(column as any).dataIndex] ? { defaultFilteredValue: savedFilter[(column as any).dataIndex] } : {}),
      };
    }
    return {
      ...column,
      ...((savedSorter as any).field === (column as any).dataIndex ? { defaultSortOrder: (savedSorter as any).order } : {}),
    }
  })


  const getData = (newPage: number) => {
    setLoading(true);
    setTimeout(() => {
      const newData = generateTestData(newPage);
      setData(prevData => [...prevData, ...newData]);
      setLoading(false);
    }, 500);
  };

  const generateTestData = (page: number) => {
    const newData = [];
    const startIndex = (page - 1) * 10;
    for (let i = startIndex; i < startIndex + 10; i++) {
      newData.push(testData[i]);
    }
    return newData;
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight;
    if (bottom) {
      setPage((prevPage) => ++prevPage);
    }
  };

  useEffect(() => {
    getData(page);
  }, [page]);

  const defaultCheckedList = columns.map((item) => {
    return item.title as string;
  });
  const [checkedList, setCheckedList] = useState<string[]>([]);

  useEffect(() => {
    const hiddenColumns = localStorage.getItem('hiddenColumns');
    if (hiddenColumns) {
      setCheckedList(JSON.parse(hiddenColumns));
    } else {
      setCheckedList(defaultCheckedList);
    }
  }, []);

  const options = columns.map(({ key, title }) => ({
    label: title,
    value: title,
  }));

  const newColumns = dynamicColumns.map((item) => ({
    ...item,
    hidden: !checkedList.includes(item.title as string),
  }));

  return (
    <>
      <Divider>Columns displayed</Divider>
      <Checkbox.Group
        style={{ marginLeft: 24 }}
        value={checkedList}
        options={options as CheckboxOptionType[]}
        onChange={(value) => {
          setCheckedList(value as string[]);
          localStorage.setItem('hiddenColumns', JSON.stringify(value))
        }}
      />


      <div style={{ height: '480px', overflow: 'auto' }} onScroll={handleScroll}>
        <Table
          columns={newColumns as ColumnsType<DataType>}
          rowKey={(record) => record?.key}
          dataSource={data}
          loading={loading}
          onChange={(pagination, filters, sorter) => {
            setFilters(filters);
            setSorter(sorter);
          }}
          style={{ marginTop: 48 }}
          pagination={false}
          scroll={{ y: 500, scrollToFirstRowOnChange: true }}
          virtual
          footer={() => (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              {loading && 'Loading...'}
            </div>
          )}
        />
      </div>
    </>

  );
};

export default App;